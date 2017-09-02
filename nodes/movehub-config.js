module.exports = function (RED) {
    const movehub = require('movehub');
    const hubs = {};

    function MovehubConfigNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.users = {};

        this.register = function (moveHubNode) {
            node.users[moveHubNode.id] = moveHubNode;
        };

        this.deregister = function (moveHubNode, done) {
            delete node.users[moveHubNode.id];
            return done();
        };

        this.mac = config.mac;

        movehub.on('ble-ready', status => {
            console.log('movehub ble-ready', status);
            this.bleStatus = status;
            if (this.bleStatus) {
                this.setStatus('ble-ready');
            } else {
                this.setStatus('ble-missing');
            }
        });

        this.connect = function (mac) {
            movehub.connect(mac, (err, boost) => {
                if (err) {
                    console.log('movehub connect err', err);
                    return;
                }
                this.boost = boost;
                this.events();
            });
        };

        this.events = function () {
            this.boost.on('connect', () => {
                this.setStatus('connect');
            });

            this.boost.on('disconnect', () => {
                if (this.bleStatus) {
                    this.setStatus('ble-ready');
                } else {
                    this.setStatus('ble-missing');
                }
            });

            this.boost.on('distance', d => {
                this.emit('distance', d);
            });

            this.boost.on('color', c => {
                this.emit('color', c);
            });

            this.boost.on('tilt', t => {
                this.emit('tilt', t);
            });

            this.boost.on('rotation', r => {
                this.emit('rotation', r);
            });
        };

        if (this.bleStatus && this.mac && !this.boost) {
            this.connect(this.mac);
        }

        movehub.on('hub-found', hub => {
            console.log('movehub hub-found', hub.address, this.mac);
            hubs[hub.address] = hub;
            if (hub.address === this.mac && !this.boost) {
                this.connect(this.mac);
            }
        });

        this.led = function (color) {
            if (this.boost) {
                this.boost.led(color);
            }
        };

        this.motorAngle = function (port, angle, dc) {
            if (this.boost) {
                this.boost.motorAngle(port, angle, dc);
            }
        };

        this.motorTime = function (port, time, dc) {
            if (this.boost) {
                this.boost.motorTime(port, time, dc);
            }
        };

        this.setStatus = function (c) {
            let s;
            switch (c) {
                case 'ble-ready':
                    s = {
                        fill: 'yellow',
                        shape: 'ring',
                        text: 'bluetooth ready'
                    };
                    break;
                case 'connect':
                    s = {
                        fill: 'green',
                        shape: 'dot',
                        text: 'connected'
                    };
                    break;
                case 'ble-missing':
                    s = {
                        fill: 'red',
                        shape: 'ring',
                        text: 'bluetooth error'
                    };
                    break;
                default:
                    s = {
                        fill: 'red',
                        shape: 'ring',
                        text: c
                    };
            }

            Object.keys(node.users).forEach(id => {
                node.users[id].status(s);
            });
        };

        this.on('close', function (done) {
            this.boost.disconnect();
            delete this.boost;
            done();
        });
    }

    RED.httpAdmin.get('/movehub-discover', (req, res) => {
        console.log('movehub-discover', req.query);
        res.status(200).send(JSON.stringify({
            hubs
        }));
    });

    RED.nodes.registerType('movehub-config', MovehubConfigNode, {});
};

module.exports = function (RED) {
    function MovehubTiltNode(n) {
        RED.nodes.createNode(this, n);

        this.boost = RED.nodes.getNode(n.hub);
        this.boost.register(this);

        this.boost.on('tilt', t => {
            this.send([{payload: t}, {payload: t.pitch}, {payload: t.roll}]);
        });
    }
    RED.nodes.registerType('movehub-tilt', MovehubTiltNode);
};

module.exports = function (RED) {
    function MovehubMotorMultiNode(n) {
        RED.nodes.createNode(this, n);

        this.boost = RED.nodes.getNode(n.hub);
        this.boost.register(this);

        this.on('input', msg => {
            console.log('motor input', msg);

            const port = msg.port || n.port;
            const angle = msg.angle || n.angle;
            const time = msg.time || n.time;
            const dca = msg.dca || n.dca;
            const dcb = msg.dcb || n.dcb;

            console.log(`port ${port} angle ${angle} time ${time} dca ${dca} dcb ${dcb}`);
            if (angle && angle !== 0) {
                this.boost.motorAngleMulti(angle, dca, dcb);
            } else if (time && time !== 0) {
                this.boost.motorTimeMulti(time, dca, dcb);
            }
        });
    }
    RED.nodes.registerType('movehub-motor-multi', MovehubMotorMultiNode);
};

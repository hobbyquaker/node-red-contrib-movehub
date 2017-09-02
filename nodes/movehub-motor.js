module.exports = function (RED) {
    function MovehubMotorNode(n) {
        RED.nodes.createNode(this, n);

        this.boost = RED.nodes.getNode(n.hub);
        this.boost.register(this);

        this.on('input', msg => {
            console.log('motor input', msg);

            const port = msg.port || n.port;
            const angle = msg.angle || n.angle;
            const time = msg.time || n.time;
            const dc = msg.dc || n.dc;


            console.log(`port ${port} angle ${angle} time ${time} dc ${dc}`);
            if (angle && angle !== 0) {
                this.boost.motorAngle(port, angle, dc);
            } else if (time && time !== 0) {
                this.boost.motorTime(port, time, dc);
            }
        });
    }
    RED.nodes.registerType('movehub-motor', MovehubMotorNode);
};

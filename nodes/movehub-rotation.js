module.exports = function (RED) {
    function MovehubRotationNode(n) {
        RED.nodes.createNode(this, n);

        this.boost = RED.nodes.getNode(n.hub);
        this.boost.register(this);

        this.boost.on('rotation', r => {
            if (r.port === n.port) {
                this.send({payload: r.angle});
            }
        });
    }
    RED.nodes.registerType('movehub-rotation', MovehubRotationNode);
};

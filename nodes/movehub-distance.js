module.exports = function (RED) {
    function MovehubDistanceNode(n) {
        RED.nodes.createNode(this, n);

        this.boost = RED.nodes.getNode(n.hub);
        this.boost.register(this);

        this.boost.on('distance', d => {
            this.send({payload: d});
        });
    }
    RED.nodes.registerType('movehub-distance', MovehubDistanceNode);
};

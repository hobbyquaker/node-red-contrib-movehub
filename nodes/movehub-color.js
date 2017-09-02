module.exports = function (RED) {
    function MovehubColorNode(n) {
        RED.nodes.createNode(this, n);

        this.boost = RED.nodes.getNode(n.hub);
        this.boost.register(this);

        this.boost.on('color', c => {
            this.send({payload: c});
        });
    }
    RED.nodes.registerType('movehub-color', MovehubColorNode);
};

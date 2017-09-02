module.exports = function (RED) {
    function MovehubLedNode(n) {
        RED.nodes.createNode(this, n);

        this.boost = RED.nodes.getNode(n.hub);
        this.boost.register(this);

        this.on('input', msg => {
            console.log('led input', msg);
            this.boost.led(msg.payload);
        });
    }
    RED.nodes.registerType('movehub-led', MovehubLedNode);
};

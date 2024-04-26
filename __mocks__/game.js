const game = {
    actors: [],
    addActor: function (actor) {
        this.actors.push(actor);
    },
    reset: function () {
        this.actors = [];
    },
    settings: {
        data: {},
        register: function(module, key, settingsObject) {
            if (!this.data[module]) {
                this.data[module] = {};
            }
            this.data[module][key] = settingsObject;
        },
        get: function(module, key) {
            return this.data[module] ? this.data[module][key] : undefined;
        }
    }
};
export default game;
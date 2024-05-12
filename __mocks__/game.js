import User from "./user.js";

const game = {
    constructor: function () {
        this.user = new User();
        this.actors = [];
        this.settings.data = {};
    },

    addActor: function (actor) {
        this.actors.push(actor);
    },
    settings: {
        register: function (module, key, settingsObject) {
            if (!this.data[module]) {
                this.data[module] = {};
            }
            this.data[module][key] = settingsObject.default;
        },
        get: function (module, key) {
            return this.data[module] ? this.data[module][key] : undefined;
        },
        set: function (module, key, value) {
            if (!this.data[module]) {
                this.data[module] = {};
            }
            this.data[module][key] = value;
        }
    },
    reset: function () {
        this.actors = [];
        this.settings.data = {};
    },
};

export default game;

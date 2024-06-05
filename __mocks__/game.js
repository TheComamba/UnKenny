import Collection from "./collection.js";
import User from "./user.js";

const game = {
    user: new User(),
    actors: new Collection(),
    messages: new Collection(),

    addActor: function (actor) {
        this.actors.set(actor.id, actor);
    },

    settings: {
        data: {},
        register: function (module, key, settingsObject) {
            if (!this.data[module]) {
                this.data[module] = {};
            }

            if (settingsObject.choices) {
                if ((settingsObject.choices instanceof Map)) {
                    console.error('Choices must not be an instance of Map');
                    return;
                }
                for (let choiceKey in settingsObject.choices) {
                    if (typeof choiceKey !== 'string' || typeof settingsObject.choices[choiceKey] !== 'string') {
                        console.error('Choices must be of the form {String: String}');
                        return;
                    }
                }
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
        this.actors = new Collection();
        this.messages = new Collection();
        this.settings.data = {};
    },
};

export default game;

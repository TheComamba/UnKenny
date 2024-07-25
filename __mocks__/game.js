import Collection from "./collection.js";
import User from "./user.js";
import i18n from 'i18next';
import Backend from 'i18next-fs-backend';

i18n.use(Backend)
    .init({
        lng: 'en', // Active language
        fallbackLng: false, // Disable fallback language for tests
        preload: ['en'], // Preload all languages you want to use
        ns: ['translation'], // Namespaces to load (if your translation files are named differently, adjust this)
        defaultNS: 'translation', // Default namespace
        saveMissing: true, // Enable saving missing keys
        missingKeyHandler: (lng, ns, key, _fallbackValue) => {
            // Throw an error when a key is missing
            throw new Error(`Missing translation key: ${key} in namespace: ${ns} for language: ${lng}`);
        },
        backend: {
            // Adjust the loadPath to match the new structure
            loadPath: 'src/lang/{{lng}}.json',
        },
    }, (err, t) => {
        if (err) return console.error(err);
        i18n.localize = (...args) => {
            if (args.length > 1) {
                throw new Error("Localize called with more than one argument. Did you mean to call format?");
            }
            return t(args[0]);
        };
        i18n.format = (...args) => {
            if (args.length < 2) {
                throw new Error("Format called with less than two arguments. Did you mean to call localize?");
            }
            let resolved = t(args[0]);
            let replacements = args[1];

            if (typeof replacements === 'object' && replacements !== null) {
                for (let key in replacements) {
                    if (replacements.hasOwnProperty(key)) {
                        const placeholder = `{${key}}`;
                        if (!resolved.includes(placeholder)) {
                            throw new Error(`Placeholder ${placeholder} not found in the resolved string.`);
                        }
                        resolved = resolved.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
                    }
                }
            }
            return resolved;
        }
    });

const game = {
    user: new User(),
    actors: new Collection(),
    messages: new Collection(),
    i18n: i18n,

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

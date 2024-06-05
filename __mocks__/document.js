import DataModel from './data-model.js';
import { generateRandomId } from './utils.js';

class Document extends DataModel {
    constructor(data, options = {}) {
        super(data, options);
        this.flags = new Map();
        this.id = generateRandomId();
    }

    _initialize(options = {}) {
        super._initialize(options);
    }

    async _preCreate(data, options, user) { }

    setFlag(module, key, value) {
        if (!this.flags.has(module)) {
            this.flags.set(module, new Map());
        }
        this.flags.get(module).set(key, value);
    }

    getFlag(module, key) {
        if (this.flags.has(module)) {
            return this.flags.get(module).get(key);
        }
        return null;
    }

    unsetFlag(module, key) {
        if (this.flags.has(module)) {
            this.flags.get(module).delete(key);
        }
    }
}

export default Document;

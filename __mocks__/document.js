import Collection from './collection.js';
import DataModel from './data-model.js';

class Document extends DataModel {
    constructor(data, options = {}) {
        super(data, options);
        this.flags = new Collection();
    }

    _initialize(options = {}) {
        super._initialize(options);
    }

    async _preCreate(data, options, user) { }

    async setFlag(module, key, value) {
        if (!this.id) {
            throw new Error("Document must have an id before setting a flag.");
        }
        if (!this.flags.has(module)) {
            this.flags.set(module, new Collection());
        }
        this.flags.get(module).set(key, value);
    }

    async getFlag(module, key) {
        if (!this.id) {
            throw new Error("Document must have an id before getting a flag.");
        }
        if (this.flags.has(module)) {
            return this.flags.get(module).get(key);
        }
        return null;
    }

    async unsetFlag(module, key) {
        if (!this.id) {
            throw new Error("Document must have an id before unsetting a flag.");
        }
        if (this.flags.has(module)) {
            this.flags.get(module).delete(key);
        }
    }
}

export default Document;

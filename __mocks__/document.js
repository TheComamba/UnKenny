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
        if (!this.flags[module]) {
            this.flags[module] = new Collection();
        }
        this.flags[module][key] = value;
    }

    async getFlag(module, key) {
        if (!this.id) {
            throw new Error("Document must have an id before getting a flag.");
        }
        if (this.flags[module]) {
            return this.flags[module][key];
        }
        return null;
    }

    async unsetFlag(module, key) {
        if (!this.id) {
            throw new Error("Document must have an id before unsetting a flag.");
        }
        if (this.flags[module]) {
            this.flags[module].delete(key);
        }
    }
}

export default Document;

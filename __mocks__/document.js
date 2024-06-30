import DataModel from './data-model.js';

export default class Document extends DataModel {
    constructor(data, options = {}) {
        super(data, options);
        this.flags = {};
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
            this.flags[module] = {};
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
            delete this.flags[module][key];
        }
    }

}

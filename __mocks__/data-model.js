import { getUniqueTimestamp } from "./utils.js";

class DataModel {
    constructor(data = {}, { parent = null, strict = true, ...options } = {}) {
        data.timestamp = getUniqueTimestamp()
        this._source = deepCopy(data);
    }

    _initialize(options = {}) {
        this.applySources();
    }

    updateSource(changes = {}, options = {}) {
        this.applySources(changes);
        if (!options.dryRun) this._initialize();
    }

    applySources() {
        this.data = deepCopy(this._source);
        for (let [k, v] of Object.entries(this._source)) {
            this[k] = v;
        }
    }
}

function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

export default DataModel;

class DataModel {
    constructor(data = {}, { parent = null, strict = true, ...options } = {}) {
        this._source = data;
    }

    updateSource(changes = {}, options = {}) {
        for (let [k, v] of Object.entries(changes)) {
            this[k] = v;
        }
        if (!options.dryRun) this._initialize();
    }
}

export default DataModel;

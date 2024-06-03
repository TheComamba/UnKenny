class DataModel {
    constructor(data = {}, { parent = null, strict = true, ...options } = {}) {
        this._source = data;
    }

    _initialize(options = {}) {
        this.applySources();
    }

    updateSource(changes = {}, options = {}) {
        this.applySources(changes);
        if (!options.dryRun) this._initialize();
    }

    applySources() {
        for (let [k, v] of Object.entries(this._source)) {
            this[k] = v;
        }
    }
}

export default DataModel;

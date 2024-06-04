import DataModel from './data-model.js';

class Document extends DataModel {
    _initialize(options = {}) {
        super._initialize(options);
    }

    async _preCreate(data, options, user) { }
}

export default Document;

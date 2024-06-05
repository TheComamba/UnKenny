import Document from "./document.js";

class BaseActor extends Document {
    _initialize(options = {}) {
        super._initialize(options);
    }

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

export default BaseActor;

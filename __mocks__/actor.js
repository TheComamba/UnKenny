import { generateRandomId } from "./utils.js";

class Actor {
    constructor() {
        this.id = generateRandomId();
        this.flags = new Map();
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
}

export default Actor;

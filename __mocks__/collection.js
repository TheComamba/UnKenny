class Collection extends Map {
    constructor(entries) {
        super(entries);
    }

    [Symbol.iterator]() {
        return this.values();
    }

    get contents() {
        return Array.from(this.values());
    }

    find(condition) {
        let i = 0;
        for (let v of this.values()) {
            if (condition(v, i, this)) return v;
            i++;
        }
        return undefined;
    }
}

export default Collection;

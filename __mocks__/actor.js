import BaseActor from "./base-actor.js";

class Actor extends BaseActor {
    constructor(name = "") {
        super();
        this.name = name;
    }
}

export default Actor;

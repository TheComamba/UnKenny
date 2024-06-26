import BaseActor from "./base-actor.js";
import { generateRandomId } from "./utils.js";

export default class Actor extends BaseActor {
    constructor(name = "") {
        super();
        this.name = name;
        this.id = generateRandomId();
    }
}

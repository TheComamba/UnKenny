import { generateRandomId } from "./utils.js";

export default class User {
  constructor(name = "DefaultUser") {
    this.id = generateRandomId();
    this.name = name;
  }
}

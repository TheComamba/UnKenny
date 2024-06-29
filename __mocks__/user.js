import { generateRandomId } from "./utils.js";

class User {
  constructor(name = "DefaultUser") {
    this.id = generateRandomId();
    this.name = name;
  }
}

export default User;

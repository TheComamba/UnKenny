import { generateRandomId } from "./utils.js";

class User {
  constructor() {
    this.id = generateRandomId();
    this.name = "DefaultUser";
  }
}

export default User;

import { generateRandomId } from "./utils.js";

class User {
  constructor() {
    this.id = generateRandomId();
  }
}

export default User;

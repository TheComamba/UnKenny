export default class UnKennyNPC {
    name;
    preamble;

    static async create(params) {
        let unKenny = new UnKennyNPC();
        unKenny.name = params["name"];
        unKenny.preamble = params["preamble"];
        return unKenny;
    }
}
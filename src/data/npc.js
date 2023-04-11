export default class UnKennyNPC extends Actor {
    preamble;

    static async create(params) {
        params["type"] = "character";
        let actor = await Actor.create(params);
        return actor;
    }
}
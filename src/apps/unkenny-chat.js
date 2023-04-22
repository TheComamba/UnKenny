import { respondInChat } from "../scripts/chat.js";

class UnKennyChat extends Application {
    constructor(actor) {
        super();
        this.actor = actor;
    }

    get template() {
        return `modules/unkenny/apps/unkenny-chat.hbs`;
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        context.name = this.actor.name;
        return context;
    }

    async _updateObject(_event, formData) {
        respondInChat(this.actor, "Some response.");
    }
}

export { UnKennyChat };
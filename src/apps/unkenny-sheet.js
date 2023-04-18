export default class UnKennySheet extends FormApplication {
    constructor(actor) {
        super();
        this.actor = actor;
    }

    get template() {
        return `modules/unkenny-npc/apps/unkenny-sheet.hbs`;
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        context.preamble = this.actor.getFlag("unkenny-npc", "preamble");
        return context;
    }

    async _updateObject(_event, formData) {
        await this.actor.setFlag("unkenny-npc", "preamble", formData.preamble);
        console.log("Updated flags", this.actor.flags);
    }
}
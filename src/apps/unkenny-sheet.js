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
        context.title = "Edit UnKennyness parameters";
        context.object = this.actor;
        return context;
    }

    async _updateObject(_event, formData) {
        this.actor.flags.unkenny_preamble = formData.preamble;
        console.log("Updated flags", this.actor.flags);
    }
}
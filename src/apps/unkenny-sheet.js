class UnKennySheet extends FormApplication {
    constructor(actor) {
        super();
        this.actor = actor;
    }

    get template() {
        return `modules/unkenny/apps/unkenny-sheet.hbs`;
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        context.preamble = this.actor.getFlag("unkenny", "preamble");
        return context;
    }

    async _updateObject(_event, formData) {
        await this.actor.setFlag("unkenny", "preamble", formData.preamble);
        console.log("Updated flags", this.actor.flags);
    }
}

export {UnKennySheet};
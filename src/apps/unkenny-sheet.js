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
        console.log("\n\n\n\n\ngetData ",context);
        return context;
    }
}
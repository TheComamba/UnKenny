export default class UnKennySheet extends FormApplication {
    get template() {
        return `modules/unkenny-npc/apps/unkenny-sheet.hbs`;
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        context.name = "gabi";
        context.preamble = "ken";
        return context;
    }
}
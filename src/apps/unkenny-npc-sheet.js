export default class UnKennyNPCSheet extends JournalTextPageSheet {
    get template() {
        return `modules/unkenny-llm-npc/apps/${this.isEditable ? "edit" : "view"}-unkenny-npc.hbs`;
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        context.name = TextEditor.enrichHTML(this.object.system.name);
        context.preamble = TextEditor.enrichHTML(this.object.system.preamble);
        return context;
    }
}
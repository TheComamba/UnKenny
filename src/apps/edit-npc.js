export default class EditNPCApp extends FormApplication {
    constructor(npc) {
        super();
        this.npc = npc;
    }

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `edit-${GLOBALS.ID}`,
            title: "Edit UnKenny NPC",
            template: `modules/${GLOBALS.ID}/apps/edit-npc.hbs`,
            width: 720,
            closeOnSubmit: true,
        });
    }

    /** @override */
    getData() {
        return {
            npc: this.npc,
        };
    }

    /** @override */
    async _updateObject(event, formData) {
        this.npc.name = formData.name;
        this.npc.preamble = formData.preamble;
        console.log("Updated UnKenny NPC:", this.npc);
    }
}
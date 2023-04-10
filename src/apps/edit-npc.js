export default class EditNPCApp extends FormApplication {
    constructor(npc) {
        super();
        this.npc = npc;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['form'],
            id: "edit-npc",
            title: "Edit UnKenny NPC",
            template: `modules/unkenny-llm-npc/apps/edit-npc.hbs`,
            width: 720,
        });
    }

    //override
    getData() {
        return {
            npc: this.npc,
        };
    }

    //override
    activateListeners(html) {
        super.activateListeners;
        html.find("button.cancel").on("click", this._onClickCancelButton.bind(this));
        html.find("button.save").on("click", this._onClickSaveButton.bind(this));
    }

    async _onClickCancelButton(event) {
        console.log("Edit UnKenny NPC cancelled.");
        console.log(this.npc.name);
        console.log(this.npc.preamle);
    }

    async _onClickSaveButton(event) {
        console.log("Saving UnKenny NPC.");
        console.log(this.npc.name);
        console.log(this.npc.preamle);
    }

    //override
    async _updateObject(event, formData) {
        console.log("Updating UnKenny NPC form.");
    }
}
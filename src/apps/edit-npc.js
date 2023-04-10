export default class EditNPCApp extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "edit-npc",
            title: "Edit UnKenny NPC",
            template: `modules/unkenny-llm-npc/apps/edit-npc.hbs`,
            width: 720,
        });
    }

    //override
    activateListeners(html) {
        super.activateListeners;
        html.find("button.cancel").on("click", this._onClickCancelButton.bind(this));
        html.find("button.save").on("click", this._onClickSaveButton.bind(this));
    }

    async _onClickCancelButton(event) {
        console.log("Edit UnKenny NPC cancelled.");
    }

    async _onClickSaveButton(event) {
        console.log("Saving UnKenny NPC.");
    }
}
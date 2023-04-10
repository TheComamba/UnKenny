export default class EditNPCApp extends FormApplication {
    name = "gabi";
    preamble = "ken";

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "edit-npc",
            title: "Edit UnKenny NPC",
            template: `modules/unkenny-llm-npc/apps/edit-npc.hbs`,
            width: 720,
        });
    }

    //override
    getData() {
        return {
            name: this.name,
            preamble: this.preamble,
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
        console.log(this.name);
        console.log(this.preamble);
    }

    async _onClickSaveButton(event) {
        console.log("Saving UnKenny NPC.");
        console.log(this.name);
        console.log(this.preamble);
    }
}
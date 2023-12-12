import { updateMacro } from "../scripts/macro.js";

class UnKennySheet extends DocumentSheet {
    constructor(actor) {
        super();
        this.object = actor;
    }

    get template() {
        return `modules/unkenny/apps/unkenny-sheet.hbs`;
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        context.preamble = this.object.getFlag("unkenny", "preamble");
        context.models = [
            { name: "" },
            { name: "Felladrin/onnx-bloomz-560m-sft-chat" },
            { name: "mkly/TinyStories-1M-ONNX" }
        ];
        let model = this.object.getFlag("unkenny", "model") || "";
        context.models.forEach(m => {
            if (m.name == model) {
                m.isSelected = true;
            }
        });
        return context;
    }

    async _updateObject(_event, formData) {
        await this.object.setFlag("unkenny", "preamble", formData.preamble);
        await this.object.setFlag("unkenny", "model", formData.model);
        await updateMacro(this.object);
    }
}

export { UnKennySheet };
import { updateMacro } from "../scripts/macro.js";

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
        context.models = [
            { name: "" },
            { name: "Felladrin/onnx-bloomz-560m-sft-chat" },
            { name: "mkly/TinyStories-1M-ONNX" }
        ];
        let model = this.actor.getFlag("unkenny", "model");
        if (!model) {
            model = "";
        }
        context.models.forEach(m => {
            if (m.name == model) {
                m.isSelected = true;
            }
        });
        return context;
    }

    async _updateObject(_event, formData) {
        await this.actor.setFlag("unkenny", "preamble", formData.preamble);
        
        const selectedModel = formData.models.find(m => m.isSelected)?.name;
        await this.actor.setFlag("unkenny", "model", selectedModel);
        
        await updateMacro(this.actor);
    }
}

export { UnKennySheet };
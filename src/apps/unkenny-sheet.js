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

        context.preamble = this.object.getFlag("unkenny", "preamble") || "";

        // Models to choose from: 
        // https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&language=en&sort=trending
        context.models = [
            { name: "" },
            { name: "Felladrin/onnx-bloomz-560m-sft-chat" },
            { name: "mkly/TinyStories-1M-ONNX" }
        ];
        let currentModel = this.object.getFlag("unkenny", "model") || "";
        context.models.forEach(m => {
            if (m.name == currentModel) {
                m.isSelected = true;
            }
        });

        context.prefixWithTalk = this.object.getFlag("unkenny", "prefixWithTalk") || false;

        return context;
    }

    async _updateObject(_event, formData) {
        await this.object.setFlag("unkenny", "preamble", formData.preamble);
        await this.object.setFlag("unkenny", "model", formData.model);
        await this.object.setFlag("unkenny", "prefixWithTalk", formData.prefixWithTalk);
        await updateMacro(this.object);
    }
}

export { UnKennySheet };
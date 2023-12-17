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
        // https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
        context.models = [
            { text: "" , value: "{}"},
            { text: "Felladrin Bloomz (ca. 3 GB RAM)", value: JSON.stringify({path: "Felladrin/onnx-bloomz-560m-sft-chat", type: "local"})},
            { text: "Felladrin GPT2 (ca. 1 GB RAM)", value: JSON.stringify({path: "Felladrin/onnx-gpt2-conversational-retrain", type: "local"})},
            { text: "Felladrin GPT2 Large (ca. 2 GB RAM)", value: JSON.stringify({path: "Felladrin/onnx-gpt2-large-conversational-retrain", type: "local"})},
            { text: "Xenova GPT2 Large (ca. 2 GB RAM)", value: JSON.stringify({path: "Xenova/gpt2-large-conversational", type: "local"})},
            { text: "OpenAI GPT-3.5-turbo", value: JSON.stringify({path: "gpt-3.5-turbo", type: "api"})},
            { text: "OpenAI gpt-4-preview", value: JSON.stringify({path: "gpt-4-1106-preview", type: "api"})}
        ];
        let currentModel = this.object.getFlag("unkenny", "model") || "";
        context.models.forEach(m => {
            if (JSON.parse(m.value).path == currentModel) {
                m.isSelected = true;
            }
        });
        context.llmAPIKey = this.object.getFlag("unkenny", "llmAPIKey") || "";

        context.minNewTokens = this.object.getFlag("unkenny", "minNewTokens") || 3;
        context.maxNewTokens = this.object.getFlag("unkenny", "maxNewTokens") || 128;
        context.repetitionPenalty = this.object.getFlag("unkenny", "repetitionPenalty") || 1.2;

        context.prefixWithTalk = this.object.getFlag("unkenny", "prefixWithTalk") || false;

        return context;
    }

    async _updateObject(_event, formData) {
        await this.object.setFlag("unkenny", "preamble", formData.preamble);
        await this.object.setFlag("unkenny", "model", JSON.parse(formData.model).path);
        await this.object.setFlag("unkenny", "llmType", JSON.parse(formData.model).type);
        await this.object.setFlag("unkenny", "llmAPIKey", formData.llmAPIKey);
        await this.object.setFlag("unkenny", "minNewTokens", formData.minNewTokens);
        await this.object.setFlag("unkenny", "maxNewTokens", formData.maxNewTokens);
        await this.object.setFlag("unkenny", "repetitionPenalty", formData.repetitionPenalty);
        await this.object.setFlag("unkenny", "prefixWithTalk", formData.prefixWithTalk);
        await updateMacro(this.object);
    }
}

export { UnKennySheet };
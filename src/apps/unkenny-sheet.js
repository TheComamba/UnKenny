import { updateMacro } from "../scripts/macro.js";

class UnKennySheet extends DocumentSheet {
    constructor(actor) {
        super();
        this.context = {};
        this.object = actor;
    }

    get template() {
        return `modules/unkenny/apps/unkenny-sheet.hbs`;
    }

    async getData(options = {}) {
        if (Object.keys(this.context).length === 0) {
            this.context = await super.getData(options);
            this.context.resizable = true;
            this.initContextModels();
            this.initContextWithActorData();
        }

        return this.context;
    }

    initContextModels() {
        // Models to choose from: 
        // https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
        this.context.models = [
            { text: "", value: "{}" },
            { text: "Felladrin Bloomz (ca. 3 GB RAM)", path: "Felladrin/onnx-bloomz-560m-sft-chat", type: "local" },
            { text: "Felladrin GPT2 (ca. 1 GB RAM)", path: "Felladrin/onnx-gpt2-conversational-retrain", type: "local" },
            { text: "Felladrin GPT2 Large (ca. 2 GB RAM)", path: "Felladrin/onnx-gpt2-large-conversational-retrain", type: "local" },
            { text: "Xenova GPT2 Large (ca. 2 GB RAM)", path: "Xenova/gpt2-large-conversational", type: "local" },
            { text: "OpenAI GPT-3.5-turbo", path: "gpt-3.5-turbo", type: "api" },
            { text: "OpenAI GPT-4-preview", path: "gpt-4-1106-preview", type: "api" }
        ];
    }

    initContextWithActorData() {
        this.context.preamble = this.object.getFlag("unkenny", "preamble") || "";
        this.context.llmAPIKey = this.object.getFlag("unkenny", "llmAPIKey") || "";

        let currentModel = this.object.getFlag("unkenny", "model") || "";
        this.setContextModel(currentModel);

        this.context.minNewTokens = this.object.getFlag("unkenny", "minNewTokens") || 3;
        this.context.maxNewTokens = this.object.getFlag("unkenny", "maxNewTokens") || 128;
        this.context.repetitionPenalty = this.object.getFlag("unkenny", "repetitionPenalty") || 1.2;

        this.context.prefixWithTalk = this.object.getFlag("unkenny", "prefixWithTalk") || false;
    }

    async _onChangeInput(event) {
        await super._onChangeInput(event);
        let needsReRendering = false;
        if (event.target.name == "model") {
            let model = event.target.value
            this.setContextModel(model);
            needsReRendering = true;
        }
        if (needsReRendering) {
            await this.render(true);
            let position = this.position;
            position.height = "auto";
            position.width = "auto";
            setPosition(position);
        }
    }

    setContextModel(model) {
        this.context.models.forEach(m => {
            if (m.path == model) {
                m.isSelected = true;
                this.context.llmType = m.type;
            } else {
                m.isSelected = false;
            }
        });
    }

    async _updateObject(_event, formData) {
        await this.object.setFlag("unkenny", "preamble", formData.preamble);
        await this.object.setFlag("unkenny", "model", formData.model);
        await this.object.setFlag("unkenny", "llmType", this.context.llmType);
        await this.object.setFlag("unkenny", "llmAPIKey", formData.llmAPIKey);
        await this.object.setFlag("unkenny", "minNewTokens", formData.minNewTokens);
        await this.object.setFlag("unkenny", "maxNewTokens", formData.maxNewTokens);
        await this.object.setFlag("unkenny", "repetitionPenalty", formData.repetitionPenalty);
        await this.object.setFlag("unkenny", "prefixWithTalk", formData.prefixWithTalk);
        await updateMacro(this.object);
    }
}

export { UnKennySheet };

import { getModelToTextMap } from "../scripts/models.js";

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
            const models = Object.entries(getModelToTextMap());
            this.context.models = models.map(([model, text]) => ({ "model": model, "text": text }));
            this.initContextWithActorData();
        }

        return this.context;
    }

    initContextWithActorData() {
        this.context.alias = this.object.getFlag("unkenny", "alias") || "";
        this.context.preamble = this.object.getFlag("unkenny", "preamble") || "";

        let currentModel = this.object.getFlag("unkenny", "model");
        this.setContextModel(currentModel);

        this.context.minNewTokens = this.object.getFlag("unkenny", "minNewTokens");
        this.context.maxNewTokens = this.object.getFlag("unkenny", "maxNewTokens");
        this.context.repetitionPenalty = this.object.getFlag("unkenny", "repetitionPenalty");
        this.context.temperature = this.object.getFlag("unkenny", "temperature");
    }

    async _onChangeInput(event) {
        await super._onChangeInput(event);
        if (event.target.name == "model") {
            let model = event.target.value
            this.setContextModel(model);
        }
    }

    setContextModel(model) {
        this.context.models.forEach(m => {
            if (m.path == model) {
                m.isSelected = true;
            } else {
                m.isSelected = false;
            }
        });
    }

    async _updateObject(_event, formData) {
        await this.object.setFlag("unkenny", "alias", formData.alias);
        await this.object.setFlag("unkenny", "preamble", formData.preamble);
        await this.updateFlag(formData, "model");
        await this.updateFlag(formData, "minNewTokens");
        await this.updateFlag(formData, "maxNewTokens");
        await this.updateFlag(formData, "repetitionPenalty");
        await this.updateFlag(formData, "temperature");
    }

    async updateFlag(formData, key) {
        if (formData[key]) {
            await this.object.setFlag("unkenny", key, formData[key]);
        } else {
            await this.object.unsetFlag("unkenny", key);
        }
    }
}

export { UnKennySheet };
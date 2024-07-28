
import { findActorWithAlias } from "../scripts/chat-message-request.js";
import { getModelToTextMap } from "../scripts/models.js";
//todo add option to overwrite prefix.
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
            this.initModels();
            await this.initContextWithActorData();
        }

        return this.context;
    }

    initModels() {
        const modelsEntries = Object.entries(getModelToTextMap());
        let modelArray = modelsEntries.map(([model, text]) => ({ "model": model, "text": text }));
        modelArray.unshift({ "model": "", "text": "" });
        this.context.models = modelArray;
    }

    async initContextWithActorData() {
        this.context.alias = await this.object.getFlag("unkenny", "alias") || "";
        this.context.preamble = await this.object.getFlag("unkenny", "preamble") || "";

        let currentModel = await this.object.getFlag("unkenny", "model");
        this.setContextModel(currentModel);

        this.context.minNewTokens = await this.object.getFlag("unkenny", "minNewTokens");
        this.context.maxNewTokens = await this.object.getFlag("unkenny", "maxNewTokens");
        this.context.repetitionPenalty = await this.object.getFlag("unkenny", "repetitionPenalty");
        this.context.temperature = await this.object.getFlag("unkenny", "temperature");
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
            if (m.model == model) {
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

        const actor = await findActorWithAlias(formData.alias);
        if (!actor) {
            ui.notifications.error(game.i18n.localize("unkenny.sheet.settingAliasFailed"));
            return;
        }
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
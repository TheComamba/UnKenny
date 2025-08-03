// Token limits for OpenAI models can be found here:
// https://platform.openai.com/docs/models/continuous-model-upgrades
// Token limits for Google Gemini models can be found here:
// https://ai.google.dev/gemini-api/docs/models
const STATIC_MODELS_MAP = new Map([
    ["gpt-4.1-nano", { text: "OpenAI: GPT-4.1 nano", type: "openai" }],
    ["gpt-4.1-mini", { text: "OpenAI: GPT-4.1 mini", type: "openai" }],
    ["gpt-4o", { text: "OpenAI: GPT-4o", type: "openai" }],
    ["gemini-2.5-flash-lite", { text: "Google: Gemini 2.5 Flash Lite", type: "google" }],
]);

function getModelToTextMap() {
    let modelToTextMap = {};
    for (let [key, value] of STATIC_MODELS_MAP) {
        modelToTextMap[key] = value.text;
    }
    const customModel = game.settings.get("unkenny", "customModel");
    if (!customModel) {
        return modelToTextMap;
    }
    const customModelText = "Custom Model: " + customModel;
    modelToTextMap["custom"] = customModelText;
    return modelToTextMap;
}

function getModelsByType(modelType) {
    if (modelType === "custom") {
        const customModel = game.settings.get("unkenny", "customModel");
        return customModel ? [customModel] : [];
    } else {
        return Array.from(STATIC_MODELS_MAP)
            .filter(model => model[1].type === modelType)
            .map(model => model[0]);
    }
}

function getModelType(model) {
    const foundModel = STATIC_MODELS_MAP.get(model);
    return foundModel ? foundModel.type : 'custom';
}

export { getModelToTextMap, getModelType, getModelsByType };

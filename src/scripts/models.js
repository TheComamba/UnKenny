// Token limits for OpenAI models can be found here:
// https://platform.openai.com/docs/models/continuous-model-upgrades
// Token limits for Google Gemini models can be found here:
// https://ai.google.dev/gemini-api/docs/models
const MODELS_MAP = new Map([
    ["gpt-4.1-nano", { text: "OpenAI: GPT-4.1 nano", limit: 1_047_576, type: "openai" }],
    ["gpt-4.1-mini", { text: "OpenAI: GPT-4.1 mini", limit: 1_047_576, type: "openai" }],
    ["gpt-4o", { text: "OpenAI: GPT-4o", limit: 128_000, type: "openai" }],
    ["gemini-2.5-flash-lite", { text: "Google: Gemini 2.5 Flash Lite", limit: 1_048_576, type: "google" }],
]);

function getModelToTextMap() {
    let modelToTextMap = {};
    for (let [key, value] of MODELS_MAP) {
        modelToTextMap[key] = value.text;
    }
    return modelToTextMap;
}

function getHostedModels() {
    return Array.from(MODELS_MAP)
        .filter(_model => true) // Currently, only hosted models are supported.
        .map(model => model[0]);
}

function getTokenLimit(model) {
    const foundModel = MODELS_MAP.get(model);
    return foundModel ? foundModel.limit : undefined;
}

function getModelType(model) {
    const foundModel = MODELS_MAP.get(model);
    return foundModel ? foundModel.type : undefined;
}

export { getModelToTextMap, getHostedModels, getTokenLimit };

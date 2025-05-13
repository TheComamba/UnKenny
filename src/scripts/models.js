// Local models to choose from: 
// https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
// Token limits for OpenAI models can be found here:
// https://platform.openai.com/docs/models/continuous-model-upgrades
const MODELS_MAP = new Map([
    ["gpt-4.1-nano", { text: "OpenAI: GPT-4.1 nano", limit: 1_047_576  }],
    ["gpt-4.1-mini", { text: "OpenAI: GPT-4.1 mini", limit: 1_047_576 }],
    ["gpt-4o", { text: "OpenAI: GPT-4o", limit: 128_000 }]
]);

function getModelToTextMap() {
    let modelToTextMap = {};
    for (let [key, value] of MODELS_MAP) {
        modelToTextMap[key] = value.text;
    }
    return modelToTextMap;
}

function getOpenAiModels() {
    return Array.from(MODELS_MAP)
        .filter(_model => true) // Currently, only OpenAI models are included
        .map(model => model[0]);
}

function getTokenLimit(model) {
    const foundModel = MODELS_MAP.get(model);
    return foundModel ? foundModel.limit : undefined;
}

export { getModelToTextMap, getOpenAiModels, getTokenLimit };

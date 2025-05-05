// Local models to choose from: 
// https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
// Token limits for OpenAI models can be found here:
// https://platform.openai.com/docs/models/continuous-model-upgrades
const MODELS_MAP = new Map([
    ["HuggingFaceTB/SmolLM2-1.7B-Instruct", { text: "Local: SmolLM v2", limit: 2048 }],
    ["onnx-community/Llama-3.2-1B", { text: "Local: Llama 3.2 1B", limit: 2048 }],
    ["onnx-community/Llama-3.2-3B", { text: "Local: Llama 3.2 3B", limit: 2048 }],
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

function isLocal(model) {
    const foundModel = MODELS_MAP.get(model);
    const isLocal = foundModel && foundModel.text.startsWith("Local");
    return isLocal;
}

function getLocalModels() {
    return Array.from(MODELS_MAP)
        .filter(model => isLocal(model[0]))
        .map(model => model[0]);
}

function getOpenAiModels() {
    return Array.from(MODELS_MAP)
        .filter(model => !isLocal(model[0]))
        .map(model => model[0]);
}

function getTokenLimit(model) {
    const foundModel = MODELS_MAP.get(model);
    return foundModel ? foundModel.limit : undefined;
}

export { getModelToTextMap, getLocalModels, getOpenAiModels, getTokenLimit, isLocal };

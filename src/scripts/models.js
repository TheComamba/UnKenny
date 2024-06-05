// Local models to choose from: 
// https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
const MODELS_MAP = new Map([
    ["Felladrin/onnx-Minueza-32M-Chat", { text: "Local: Felladrin Minueza" }],
    ["Felladrin/onnx-TinyMistral-248M-Chat-v2", { text: "Local: Felladrin Tiny Mistral" }],
    // ["schmuell/TinyLlama-1.1B-Chat-v1.0-int4", { text: "Local: Schmuell Tiny Llama" }],  // Cannot be loaded.
    // ["Xenova/gpt2-large-conversational", { text: "Local: Xenova GPT-2 Large Conversational" }], // Outdated.
    ["Xenova/Qwen1.5-0.5B-Chat", { text: "Local: Xenova Qwen" }],
    // ["Xenova/TinyLlama-1.1B-Chat-v1.0", { text: "Local: Xenova Tiny Llama" }], // Proved to be very repetitive.
    ["gpt-3.5-turbo", { text: "OpenAI: GPT 3.5 turbo" }],
    ["gpt-4", { text: "OpenAI: GPT 4" }],
    ["gpt-4-turbo", { text: "OpenAI: GPT 4 turbo" }]
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

}

export { getModelToTextMap, getLocalModels, getOpenAiModels, getTokenLimit, isLocal };

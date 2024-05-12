function getModels() {
    // Local models to choose from: 
    // https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
    return [
        { text: "", path: "" },
        { text: "Local: Felladrin Minueza", path: "Felladrin/onnx-Minueza-32M-Chat" },
        { text: "Local: Felladrin Tiny Mistral", path: "Felladrin/onnx-TinyMistral-248M-Chat-v2" },
        // { text: "Local: Schmuell Tiny Llama", path: "schmuell/TinyLlama-1.1B-Chat-v1.0-int4" }, // Cannot be loaded.
        // { text: "Local: Xenova GPT-2 Large Conversational", path: "Xenova/gpt2-large-conversational" }, // Outdated.
        { text: "Local: Xenova Qwen", path: "Xenova/Qwen1.5-0.5B-Chat" },
        //{ text: "Local: Xenova Tiny Llama", path: "Xenova/TinyLlama-1.1B-Chat-v1.0" }, // Proved to be very repetitive.
        { text: "OpenAI: GPT 3.5 turbo", path: "gpt-3.5-turbo" },
        { text: "OpenAI: GPT 4", path: "gpt-4" },
        { text: "OpenAI: GPT 4 turbo", path: "gpt-4-turbo" }
    ];
}

function getModelsAsMap() {
    return getModels().reduce((map, obj) => {
        map[obj.path] = obj.text;
        return map;
    }, {});
}

function isLocal(model) {
    const models = getModels();
    const foundModel = models.find(m => m.path === model);
    const isLocal = foundModel && foundModel.text.startsWith("Local");
    return isLocal;
}

export { getModels, getModelsAsMap, isLocal };

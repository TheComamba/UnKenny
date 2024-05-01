function getModels() {
    // Local models to choose from: 
    // https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
    return [
        { text: "", path: "", value: "{}" },
        { text: "Local: Xenova Tiny Lllama 1.1", path: "Xenova/TinyLlama-1.1B-Chat-v1.0" },
        { text: "Local: Xenova Qwen 1.5", path: "Xenova/Qwen1.5-1.8B-Chat" },
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

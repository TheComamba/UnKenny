function getModels() {
    // Local models to choose from: 
    // https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
    return [
        { text: "", path: "", value: "{}" },
        { text: "Local: Felladrin Bloomz (ca. 3 GB RAM)", path: "Felladrin/onnx-bloomz-560m-sft-chat" },
        { text: "Local: Felladrin GPT2 (ca. 1 GB RAM)", path: "Felladrin/onnx-gpt2-conversational-retrain" },
        { text: "Local: Felladrin GPT2 Large (ca. 2 GB RAM)", path: "Felladrin/onnx-gpt2-large-conversational-retrain" },
        { text: "Local: Xenova GPT2 Large (ca. 2 GB RAM)", path: "Xenova/gpt2-large-conversational" },
        { text: "OpenAI: GPT-3.5-turbo", path: "gpt-3.5-turbo" },
        { text: "OpenAI: GPT-4-preview", path: "gpt-4-1106-preview" }
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

function getModels() {
    // Local models to choose from: 
    // https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&sort=trending
    return [
        { text: "", value: "{}" },
        { text: "Felladrin Bloomz (ca. 3 GB RAM)", path: "Felladrin/onnx-bloomz-560m-sft-chat", type: "local" },
        { text: "Felladrin GPT2 (ca. 1 GB RAM)", path: "Felladrin/onnx-gpt2-conversational-retrain", type: "local" },
        { text: "Felladrin GPT2 Large (ca. 2 GB RAM)", path: "Felladrin/onnx-gpt2-large-conversational-retrain", type: "local" },
        { text: "Xenova GPT2 Large (ca. 2 GB RAM)", path: "Xenova/gpt2-large-conversational", type: "local" },
        { text: "OpenAI GPT-3.5-turbo", path: "gpt-3.5-turbo", type: "api" },
        { text: "OpenAI GPT-4-preview", path: "gpt-4-1106-preview", type: "api" }
    ];
}

export { getModels };

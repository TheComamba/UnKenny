let AutoModelForCausalLM, AutoTokenizer;
try {
    const module = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1');
    AutoModelForCausalLM = module.AutoModelForCausalLM;
    AutoTokenizer = module.AutoTokenizer;
} catch (error) {
    if (process.env.NODE_ENV === 'test') {
        try {
            const localModule = await import('@xenova/transformers');
            AutoModelForCausalLM = localModule.AutoModelForCausalLM;
            AutoTokenizer = localModule.AutoTokenizer;
        } catch (localError) {
            throw new Error("Unable to load local module: " + localError);
        }
    } else {
        throw new Error("Unable to load module: " + error);
    }
}

import { UnKennyInfo } from '../apps/unkenny-info.js';

const modelCache = new Map();
const tokenizerCache = new Map();

async function getModelAndTokenizer(model_path) {
    let info = new UnKennyInfo(`Preparing model and tokenizer '${model_path}'...`);
    await info.render(true);

    if (modelCache.has(model_path) && tokenizerCache.has(model_path)) {
        return { model: modelCache.get(model_path), tokenizer: tokenizerCache.get(model_path) };
    }

    const model = await AutoModelForCausalLM.from_pretrained(model_path);
    const tokenizer = await AutoTokenizer.from_pretrained(model_path);

    modelCache.set(model_path, model);
    tokenizerCache.set(model_path, tokenizer);

    await info.close();

    return { model, tokenizer };
}

function tokenizedMessages(tokenizer, messages) {
    // Store the original console.warn
    let originalConsoleWarn = console.warn;
    // Override console.warn to show errors in the UI
    console.warn = function (message) {
        ui.notifications.error(message);
    };
    // The actual function call
    let prompt = tokenizer.apply_chat_template(messages, { tokenize: true });
    // Restore the original console.warn
    console.warn = originalConsoleWarn;

    return prompt;
}

async function getResponseFromLocalLLM(parameters, messages) {
    const { model, tokenizer } = await getModelAndTokenizer(parameters.model);

    const input_tokens = tokenizedMessages(tokenizer, messages);

    let info = new UnKennyInfo(`Generating ${parameters.actorName}'s response...`);
    await info.render(true);

    // https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig
    const localParameters = {
        min_new_tokens: parameters.minNewTokens,
        max_new_tokens: parameters.maxNewTokens,
        repetition_penalty: parameters.repetitionPenalty,
        temperature: parameters.temperature,
        renormalize_logits: true, // Default is false, but highly recommended to set to true...
    };

    let output_tokens
    try {
        output_tokens = await model.generate(input_tokens, localParameters);
    } catch (error) {
        ui.notifications.error('An error occurred during text generation:', error);
        await info.close();
        return;
    }
    output_tokens = output_tokens[0].slice(input_tokens.size);
    let response = tokenizer.decode(output_tokens, { skip_special_tokens: true }).trim();

    await info.close();

    return response;
}

export { getResponseFromLocalLLM };

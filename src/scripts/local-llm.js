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

function messagesToPrompt(tokenizer, messages) {
    // Store the original console.warn
    let originalConsoleWarn = console.warn;
    // Override console.warn to show errors in the UI
    console.warn = function (message) {
        ui.notifications.error(message);
    };
    // The actual function call
    let prompt = tokenizer.apply_chat_template(messages, { tokenize: false });
    // Restore the original console.warn
    console.warn = originalConsoleWarn;

    return prompt;
}

async function getResponseFromLocalLLM(parameters, messages) {
    const { model, tokenizer } = await getModelAndTokenizer(parameters.model);

    const prompt = messagesToPrompt(tokenizer, messages);
    const { input_ids } = tokenizer(prompt, { return_tensor: true }); // TODO: Not sure if return_tensor: true is correct here.

    let info = new UnKennyInfo(`Generating ${parameters.actorName}'s response...`);
    await info.render(true);

    const localParameters = {
        min_new_tokens: parameters.minNewTokens,
        max_new_tokens: parameters.maxNewTokens,
        repetition_penalty: parameters.repetitionPenalty,
        temperature: parameters.temperature,
    };
    let tokens = await model.generate(input_ids, localParameters);
    tokens = tokens[0].slice(input_ids.size);
    let response = tokenizer.decode(tokens, { skip_special_tokens: false });

    await info.close();

    return response;
}

export { getResponseFromLocalLLM };

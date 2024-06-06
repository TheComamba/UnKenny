import { UnKennyInfo } from '../apps/unkenny-info.js';
import { loadExternalModule } from './shared.js';

const modelCache = new Map();
const tokenizerCache = new Map();

async function getModel(transformersModule, model_path) {
    if (modelCache.has(model_path)) {
        return modelCache.get(model_path)
    }

    let info = new UnKennyInfo(`Preparing model '${model_path}'...`);
    await info.render(true);

    const model = await transformersModule.AutoModelForCausalLM.from_pretrained(model_path);

    await info.close();

    modelCache.set(model_path, model);
    return model;
}

async function getTokenizer(transformersModule, model_path) {
    if (tokenizerCache.has(model_path)) {
        return tokenizerCache.get(model_path);
    }

    let info = new UnKennyInfo(`Preparing model and tokenizer '${model_path}'...`);
    await info.render(true);

    const tokenizer = await transformersModule.AutoTokenizer.from_pretrained(model_path);

    await info.close();

    tokenizerCache.set(model_path, tokenizer);
    return tokenizer;
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

async function numberOfTokensForLocalLLM(model, messages) {
    const transformersModule = await loadExternalModule('@xenova/transformers', '2.17.1');
    if (!transformersModule) {
        return;
    }
    const tokenizer = await getTokenizer(transformersModule, model);
    if (!tokenizer) {
        return;
    }
    let tokenized = tokenizedMessages(tokenizer, messages);
    return tokenized.size;
}

async function getResponseFromLocalLLM(parameters, messages) {
    const transformersModule = await loadExternalModule('@xenova/transformers', '2.17.1');
    if (!transformersModule) {
        return;
    }
    const model = await getModel(transformersModule, parameters.model);
    if (!model) {
        return;
    }
    const tokenizer = await getTokenizer(transformersModule, parameters.model);
    if (!tokenizer) {
        return;
    }

    const input_tokens = tokenizedMessages(tokenizer, messages);

    let info = new UnKennyInfo(`Generating ${parameters.actorName}'s response...`);
    await info.render(true);

    // https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig
    const localParameters = {
        min_new_tokens: parameters.minNewTokens,
        max_new_tokens: parameters.maxNewTokens,
        repetition_penalty: parameters.repetitionPenalty + 1.0, // 1.0 means no penalty
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
    response = response.replace(/^assistant/i, '').trim();

    await info.close();

    return response;
}

export { getResponseFromLocalLLM, numberOfTokensForLocalLLM };

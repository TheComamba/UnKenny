import { AutoModelForCausalLM, AutoTokenizer } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.11.0';

const modelCache = new Map();
const tokenizerCache = new Map();

async function getModelAndTokenizer(model_path) {
    if (modelCache.has(model_path) && tokenizerCache.has(model_path)) {
        return { model: modelCache.get(model_path), tokenizer: tokenizerCache.get(model_path) };
    }

    ui.notifications.info("Downloading model and tokenizer '" + model_path + "'. This may take a while.");
    const model = await AutoModelForCausalLM.from_pretrained(model_path);
    const tokenizer = await AutoTokenizer.from_pretrained(model_path);
    ui.notifications.info("Finished downloading model and tokenizer '" + model_path + "'.");

    modelCache.set(model_path, model);
    tokenizerCache.set(model_path, tokenizer);

    return { model, tokenizer };
}

async function generateResponse(actor, input) {
    let model_path = await actor.getFlag("unkenny", "model");
    if (!model_path) {
        ui.notifications.error("Please select a model in the actor sheet.");
        return;
    }
    const { model, tokenizer } = await getModelAndTokenizer(model_path);

    let preamble = await actor.getFlag("unkenny", "preamble");
    if (!preamble) {
        ui.notifications.error("Please set a preamble in the actor sheet.");
        return;
    }
    let prompt = preamble + '</s>' + input + '<s>';
    let { input_ids } = tokenizer(prompt);

    let minNewTokens = await actor.getFlag("unkenny", "minNewTokens");
    if (!minNewTokens) {
        ui.notifications.error("Please set a minimum number of new tokens in the actor sheet.");
        return;
    }
    let maxNewTokens = await actor.getFlag("unkenny", "maxNewTokens");
    if (!maxNewTokens) {
        ui.notifications.error("Please set a maximum number of new tokens in the actor sheet.");
        return;
    }
    let repetitionPenalty = await actor.getFlag("unkenny", "repetitionPenalty");
    if (!repetitionPenalty) {
        ui.notifications.error("Please set a repetition penalty in the actor sheet.");
        return;
    }
    let tokens = await model.generate(input_ids, { min_new_tokens: minNewTokens, max_new_tokens: maxNewTokens, repetition_penalty: repetitionPenalty });
    let response = tokenizer.decode(tokens[0], { skip_special_tokens: false });
    response = response.substring(prompt.length);

    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk") || false;
    if (prefixWithTalk) {
        response = "/talk " + response;
    }

    return response;
}

export { generateResponse };
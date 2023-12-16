import { AutoModelForCausalLM, AutoTokenizer } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';
import { generateResponseApi } from "../scripts/openai-api.js";

async function generateResponse(actor, input) {
    let response;
    if ( await isAPI(actor) ) {
        response = getAPIResponse(actor, input)
    } else {
        response = getModelResponse(actor, input);
    }

    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk") || false;
    if (prefixWithTalk) {
        response = "/talk " + response;
    }

    return response;
}

async function getModelResponse(actor, input) {
    let model_path = await actor.getFlag("unkenny", "model");
    if (!model_path) {
        ui.notifications.error("Please select a model in the actor sheet.");
        return;
    }
    const model = await AutoModelForCausalLM.from_pretrained(model_path);
    const tokenizer = await AutoTokenizer.from_pretrained(model_path);
    
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

    return response;
}

async function getAPIResponse(actor, input) {
   return generateResponseApi(actor, input)
}

async function isAPI(actor) {
    let model = await actor.getFlag("unkenny", "model");
    if (model == "API: OpenAI") return true;
    return false;
}

export { generateResponse };
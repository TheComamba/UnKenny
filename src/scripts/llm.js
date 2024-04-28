import { getResponseFromLocalLLM } from "../scripts/local-llm.js";
import { getResponseFromOpenAI } from "../scripts/openai-api.js";
import { postInChat } from "../scripts/shared.js";

function llmParametersAndDefaults() {
    return {
        model: "",
        apiKey: "",
        minNewTokens: 1,
        maxNewTokens: 250,
        repetitionPenalty: 0.0,
        temperature: 1.0,
        prefixWithTalk: false
    };
}

async function getGenerationParameters(actor) {
    let name = actor.name;

    let model = await actor.getFlag("unkenny", "model");
    if (!model) {
        ui.notifications.error("Error: Model parameter is missing.");
        return null;
    }

    let apiKey = await actor.getFlag("unkenny", "llmAPIKey") || "";

    let preamble = await actor.getFlag("unkenny", "preamble");
    if (!preamble) {
        ui.notifications.error("Error: Preamble parameter is missing.");
        return null;
    }

    let minNewTokens = await actor.getFlag("unkenny", "minNewTokens");
    if (!minNewTokens) {
        ui.notifications.error("Error: MinNewTokens parameter is missing.");
        return null;
    }

    let maxNewTokens = await actor.getFlag("unkenny", "maxNewTokens");
    if (!maxNewTokens) {
        ui.notifications.error("Error: MaxNewTokens parameter is missing.");
        return null;
    }

    let repetitionPenalty = await actor.getFlag("unkenny", "repetitionPenalty");
    if (!repetitionPenalty) {
        ui.notifications.error("Error: RepetitionPenalty parameter is missing.");
        return null;
    }

    let llmType = await actor.getFlag("unkenny", "llmType");
    if (!llmType) {
        ui.notifications.error("Error: LLMType parameter is missing.");
        return null;
    }

    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk") || false;

    return {
        actorName: name,
        model: model,
        apiKey: apiKey,
        preamble: preamble,
        minNewTokens: minNewTokens,
        maxNewTokens: maxNewTokens,
        repetitionPenalty: repetitionPenalty,
        llmType: llmType,
        prefixWithTalk: prefixWithTalk
    };
}

async function generateResponse(actor, input) {
    let parameters = await getGenerationParameters(actor);
    if (!parameters) {
        return;
    }
    let response;
    if (parameters.llmType == 'api') {
        response = await getResponseFromOpenAI(parameters, input);
    } else if (parameters.llmType == 'local') {
        response = await getResponseFromLocalLLM(parameters, input);
    } else {
        ui.notifications.error("The selected model has neither the local nor the api property.");
        return;
    }

    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk") || false;
    if (prefixWithTalk) {
        response = "/talk " + response;
    }

    return response;
}

async function postResponse(actor, request) {
    let response = null;
    try {
        response = await generateResponse(actor, request);
    } catch (error) {
        ui.notifications.error(error);
    }
    if (response) {
        postInChat(actor, response);
    } else {
        ui.notifications.error("No response generated.");
    }
}

export { generateResponse, getGenerationParameters, llmParametersAndDefaults, postResponse };
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

async function getGenerationParameter(actor, parameterName) {
    let value = await actor.getFlag("unkenny", parameterName);
    if (!value) {
        value = game.settings.get("unkenny", parameterName);
    }
    if (!value) {
        value = llmParametersAndDefaults()[parameterName];
        ui.notifications.warning(`No value found for ${parameterName}. Using default value "${value}".`);
    }
    return value;
}

async function getGenerationParameters(actor) {
    let params = {};
    params.actorName = actor.name;
    for (let key in llmParametersAndDefaults()) {
        params[key] = await getGenerationParameter(actor, key);
    }
    params.preamble = await getGenerationParameter(actor, "preamble");
    return params;
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
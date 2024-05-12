import { getResponseFromLocalLLM } from "../scripts/local-llm.js";
import { getResponseFromOpenAI } from "../scripts/openai-api.js";
import { postInChat } from "../scripts/shared.js";
import { isLocal } from "./models.js";

function llmParametersAndDefaults() {
    return {
        model: null,
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
    if (value == null) {
        value = game.settings.get("unkenny", parameterName);
    }
    if (value == null) {
        value = llmParametersAndDefaults()[parameterName];
        ui.notifications.warning(`No value found for ${parameterName}. Using default value "${value}".`);
    }
    if (value == null) {
        ui.notifications.error(`No default value found for ${parameterName}.`);
        return null;
    }
    return value;
}

async function getGenerationParameters(actor) {
    let params = {};
    params.actorName = actor.name;
    for (let key in llmParametersAndDefaults()) {
        const param = await getGenerationParameter(actor, key);
        if (param == null) {
            return null;
        }
        params[key] = param;
    }
    params.preamble = await getGenerationParameter(actor, "preamble");
    return params;
}

function getMessages(parameters, input) {
    return [
        {
            role: 'system',
            content: parameters.preamble,
        },
        {
            role: 'user',
            content: input,
        }
    ];
}

async function generateResponse(actor, input) {
    let parameters = await getGenerationParameters(actor);
    if (!parameters) {
        return;
    }
    let messages = getMessages(parameters, input);
    let response;
    if (isLocal(parameters.model)) {
        response = await getResponseFromLocalLLM(parameters, messages);
    } else {
        response = await getResponseFromOpenAI(parameters, messages);
    }
    if (!response) {
        return;
    }

    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk") || false;
    if (prefixWithTalk) {
        response = "/talk " + response;
    }

    return response;
}

async function postResponse(actor, request) {
    let response = await generateResponse(actor, request);
    if (response) {
        postInChat(actor, response);
    } else {
        ui.notifications.error("No response generated.");
    }
}

export { generateResponse, getGenerationParameters, getMessages, llmParametersAndDefaults, postResponse };

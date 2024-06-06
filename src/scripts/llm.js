import { collectChatMessages } from "./collecting-chat-messages.js";
import { getResponseFromLocalLLM } from "../scripts/local-llm.js";
import { getResponseFromOpenAI } from "../scripts/openai-api.js";
import { isLocal } from "./models.js";
import { llmParametersAndDefaults } from "./settings.js";

function getGenerationParameter(actor, parameterName) {
    if (!actor) {
        return;
    }
    let value = actor.getFlag("unkenny", parameterName);
    if (value == null) {
        value = game.settings.get("unkenny", parameterName);
    }
    if (value == null) {
        value = llmParametersAndDefaults()[parameterName];
        ui.notifications.warning(`No value found for ${parameterName}. Using default value "${value}".`);
    }
    if (value == null) {
        ui.notifications.error(`No default value found for ${parameterName}.`);
        return;
    }
    return value;
}

function getGenerationParameters(actor) {
    if (!actor) {
        return;
    }
    let params = {};
    params.actorName = actor.name;
    for (let key in llmParametersAndDefaults()) {
        const param = getGenerationParameter(actor, key);
        if (param == null) {
            return null;
        }
        params[key] = param;
    }
    return params;
}

async function generateResponse(actor, input) {
    let parameters = getGenerationParameters(actor);
    if (!parameters) {
        return;
    }
    let messages = await collectChatMessages(actor, input);
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

export { generateResponse, getGenerationParameters };

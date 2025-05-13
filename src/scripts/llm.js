import { collectChatMessages } from "./collecting-chat-messages.js";
import { getResponseFromOpenAI } from "../scripts/openai-api.js";
import { llmParametersAndDefaults } from "./settings.js";

async function getGenerationParameter(actor, parameterName) {
    if (!actor) {
        return;
    }
    let value = await actor.getFlag("unkenny", parameterName);
    if (value == null) {
        value = game.settings.get("unkenny", parameterName);
    }
    if (value == null) {
        value = llmParametersAndDefaults()[parameterName];
        const warningMessage = game.i18n.format("unkenny.llm.noValue", { parameterName: parameterName, value: value });
        ui.notifications.warn(warningMessage);
    }
    if (value == null) {
        const errorMessage = game.i18n.format("unkenny.llm.noDefaultValue", { parameterName: parameterName });
        ui.notifications.error(errorMessage);
        return;
    }
    return value;
}

async function getGenerationParameters(actor) {
    if (!actor) {
        return;
    }
    let params = {};
    params.actorName = actor.name;
    for (let key in llmParametersAndDefaults()) {
        const param = await getGenerationParameter(actor, key);
        if (param == null) {
            return null;
        }
        params[key] = param;
    }
    return params;
}

async function generateResponse(actor, input, parameters) {
    const messages = await collectChatMessages(actor, input, parameters.maxNewTokens);
    const response = await getResponseFromOpenAI(parameters, messages);
    if (!response) {
        return;
    }

    return response;
}

export { generateResponse, getGenerationParameters };

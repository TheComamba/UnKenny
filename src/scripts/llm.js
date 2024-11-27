import { collectChatMessages } from "./collecting-chat-messages.js";
import { getResponseFromLocalLLM } from "../scripts/local-llm.js";
import { getResponseFromOpenAI } from "../scripts/openai-api.js";
import { isLocal } from "./models.js";
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

    // Get includeBiography flag
    params.includeBiography = await actor.getFlag("unkenny", "includeBiography") || false;

    // Fetch biography from the actor's character sheet
    const biography = actor.system.details.biography?.value || "";
    params.biography = biography.slice(0, 1000); // Limit to 1000 characters

    for (let key in llmParametersAndDefaults()) {
        const param = await getGenerationParameter(actor, key);
        if (param == null) {
            return null;
        }
        params[key] = param;
    }
    return params;
}

async function generateResponse(actor, request, parameters) {
    const model = parameters.model || game.settings.get("unkenny", "model");
    const maxNewTokens = parameters.maxNewTokens || game.settings.get("unkenny", "maxNewTokens");
    
    let messages = await collectChatMessages(actor, request, maxNewTokens, parameters);
    
    if (isLocal(model)) {
        return await generateLocalResponse(model, messages, parameters);
    } else {
        return await getResponseFromOpenAI(parameters, messages);
    }
}

export { generateResponse, getGenerationParameters };

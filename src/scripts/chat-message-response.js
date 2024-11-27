import { CONVERSATION_FLAG, smuggleConversationWithFlagIntoSource } from "./collecting-chat-messages.js";
import { generateResponse, getGenerationParameters } from "./llm.js";
import { prefixResponse } from "./prefix.js";

function replaceAlias(message, alias, actorName) {
    if (!message || !alias || !actorName) {
        return message;
    }
    const aliasReplacement = new RegExp("@" + alias, "gi");
    message = message.replace(aliasReplacement, actorName);
    message = message.trim();
    return message;
}

async function appendResponsePrompt(request, parameters) {
    const responsePrompt = parameters.responsePrompt || game.settings.get("unkenny", "responsePrompt");
    if (responsePrompt) {
        return `${request}\n\n[Instructions: ${responsePrompt}]`;
    }
    return request;
}

async function triggerResponse(actor, request) {
    if (!actor) {
        const errorMessage = game.i18n.localize("unkenny.chatMessage.triggerWithoutActor");
        ui.notifications.error(errorMessage);
        return;
    }
    let name = actor.name;
    let alias = await actor.getFlag("unkenny", "alias");
    request = replaceAlias(request, alias, name);

    let preamble = await actor.getFlag("unkenny", "preamble") || "";
    let parameters = await getGenerationParameters(actor);
    if (!parameters) {
        return;
    }

    const includeBiography = await actor.getFlag("unkenny", "includeBiography");
    
    if (!preamble && (!includeBiography || !parameters.biography?.trim())) {
        const errorMessage = game.i18n.localize("unkenny.chatMessage.noPreambleOrBio");
        ui.notifications.error(errorMessage);
        return;
    }

    request = await appendResponsePrompt(request, parameters);

    let response = await generateResponse(actor, request, parameters);

    if (response) {
        await respond(response, parameters, actor);
    } else {
        const errorMessage = game.i18n.localize("unkenny.chatMessage.noResponse");
        ui.notifications.error(errorMessage);
    }
}

async function respond(response, parameters, actor) {
    response = await prefixResponse(response, parameters);
    await postResponse(response, actor);
}

async function postResponse(response, actor) {
    // Convert newlines to <br> tags
    response = response.replace(/\n/g, "<br>");

    // If it's a command, strip it out for the conversation message
    let conversationContent = response;
    if (response.startsWith('/')) {
        // Remove the command and any leading spaces
        conversationContent = response.replace(/^\/\w+\s+/, '');
    }

    // Create our conversation message without the command
    let chatData = {
        speaker: {
            actor: actor.id,
            alias: actor.name
        },
        content: conversationContent,
        flags: {
            unkenny: {
                responseData: conversationContent,  // Store without command
                [CONVERSATION_FLAG]: actor.id
            }
        },
        type: CONST.CHAT_MESSAGE_TYPES.IC
    };

    // Create our message to maintain conversation history
    await ChatMessage.create(chatData);

    // If it's a command, create a separate command message
    if (response.startsWith('/')) {
        // Create a separate message for the command
        const commandData = {
            speaker: {
                actor: actor.id,
                alias: actor.name
            },
            content: response,  // Use full response with command
            type: CONST.CHAT_MESSAGE_TYPES.COMMAND
        };

        // Create and process the command separately
        await ui.chat.processMessage(response, commandData);
    }
}

function processUnKennyResponse(message) {
    let source = message._source;
    const responseData = source.flags?.unkenny?.responseData;
    if (responseData) {
        source.content = responseData;
    }
}

export { postResponse, processUnKennyResponse, replaceAlias, respond, triggerResponse };

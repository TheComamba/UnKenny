import { smuggleConversationWithFlagIntoSource } from "./collecting-chat-messages.js";
import { generateResponse, getGenerationParameters } from "./llm.js";
import { prefixResponse } from "./prefix.js";

const unkennyResponseFlag = "#UnKennyResponseChatDataInJsonFormat: "

function replaceAlias(message, alias, actorName) {
    if (!message || !alias || !actorName) {
        return message;
    }
    const aliasReplacement = new RegExp("@" + alias, "gi");
    message = message.replace(aliasReplacement, actorName);
    message = message.trim();
    return message;
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

    let parameters = await getGenerationParameters(actor);
    if (!parameters) {
        return;
    }

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
    response = response.replace(/\n/g, "<br>");

    let chatData = {
        speaker: {
            actor: actor.id,
            alias: actor.name
        },
        flags: {
            unkenny: {
                responseData: response
            }
        }
    };
    await ui.chat.processMessage(response, chatData);
}

function processUnKennyResponse(message) {
    let source = message._source;
    const responseData = source.flags?.unkenny?.responseData;
    if (responseData) {
        source.content = responseData;
        const actorId = source.speaker.actor;
        if (actorId) {
            smuggleConversationWithFlagIntoSource(source, actorId);
        }
    }
}

export { postResponse, processUnKennyResponse, replaceAlias, respond, triggerResponse, unkennyResponseFlag };

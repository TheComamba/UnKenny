import { smuggleConversationWithFlagIntoSource } from "./collecting-chat-messages.js";
import { generateResponse } from "./llm.js";

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
        ui.notifications.error("triggerResponse was called with no actor.");
        return;
    }
    let name = actor.name;
    let alias = await actor.getFlag("unkenny", "alias");
    request = replaceAlias(request, alias, name);
    let response = await generateResponse(actor, request);
    if (response) {
        await postResponse(response, actor);
    } else {
        ui.notifications.error("No response generated.");
    }
}

async function postResponse(response, actor) {
    response = response.replace(/\n/g, "<br>");

    let chatData = {
        content: response,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        speaker: {
            actor: actor.id,
            alias: actor.name
        }
    };
    await ui.chat.processMessage(unkennyResponseFlag + JSON.stringify(chatData));
}

function processUnKennyResponse(message) {
    let source = message._source;
    if (source.content.startsWith(unkennyResponseFlag)) {
        const jsonString = source.content.replace(unkennyResponseFlag, "");
        let chatDataJson;
        try {
            chatDataJson = JSON.parse(jsonString);
        } catch (error) {
            ui.notifications.error("Error parsing JSON: " + error);
            return;
        }
        for (let key in chatDataJson) {
            source[key] = chatDataJson[key] ?? source[key];
        }
        const actorId = source.speaker.actor;
        if (actorId) {
            smuggleConversationWithFlagIntoSource(source, actorId);
        }
    }
}

export { postResponse, processUnKennyResponse, replaceAlias, triggerResponse, unkennyResponseFlag };

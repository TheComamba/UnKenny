import { replaceAlias } from "./chat-message-request.js";
import { generateResponse } from "./llm.js";

const unkennyResponseFlag = "#UnKennyResponseChatDataInJsonFormat: "

async function triggerResponse(actor, request) {
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

        message.setFlag("unkenny", "conversationWith", chatDataJson.speaker.actor);
    }
}

function overwriteChatMessage() {
    const currentChatMessage = CONFIG.ChatMessage.documentClass;
    if (currentChatMessage.name === 'UnkennyChatMessage') {
        return;
    }
    class UnkennyChatMessage extends currentChatMessage {
        /** @override */
        _initialize(options = {}) {
            processUnKennyResponse(this);
            super._initialize(options);
        }
    }
    CONFIG.ChatMessage.documentClass = UnkennyChatMessage;
}

export { overwriteChatMessage, postResponse, processUnKennyResponse, triggerResponse, unkennyResponseFlag };
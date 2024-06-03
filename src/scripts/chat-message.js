import { replaceAlias } from "./chat-message-parsing.js";
import { generateResponse } from "./llm.js";

const unkennyResponseFlag = "#UnKennyResponseChatDataInJsonFormat: "

function modifyUnkennyChatData(chatData, addressedActor) {
    let name = addressedActor.name;
    let alias = addressedActor.getFlag("unkenny", "alias");
    chatData.content = replaceAlias(chatData.content, alias, name);
}

async function triggerResponse(actor, request) {
    let response = await generateResponse(actor, request);
    if (response) {
        await postResponse(response, actor);
    } else {
        ui.notifications.error("No response generated.");
    }
}

async function postResponse(response, actor) {
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

function processUnKennyResponseSource(source) {
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
            processUnKennyResponseSource(this._source);
            super._initialize(options);
        }
    }
    CONFIG.ChatMessage.documentClass = UnkennyChatMessage;
}

export { modifyUnkennyChatData, overwriteChatMessage, postResponse, processUnKennyResponseSource, triggerResponse, unkennyResponseFlag };

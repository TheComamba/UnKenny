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
        let chatData = {
            content: response,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            actorName: actor.name
        };
        new ChatLog().processMessage(unkennyResponseFlag + JSON.stringify(chatData));
    } else {
        ui.notifications.error("No response generated.");
    }
}

function processUnKennyResponseData(data, user) {
    if (data.content.startsWith(unkennyResponseFlag)) {
        let chatDataJson = JSON.parse(data.content.replace(unkennyResponseFlag, ""));
        for (let key in chatDataJson) {
            data[key] = chatDataJson[key] ?? data[key];
        }
    }
}

function overwriteChatMessage() {
    const currentChatMessage = CONFIG.ChatMessage.documentClass;
    class UnkennyChatMessage extends currentChatMessage {
        /** @override */
        async _preCreate(data, options, user) {
            processUnKennyResponseData(data, user);
            await super._preCreate(data, options, user);
        }

    }
    CONFIG.ChatMessage.documentClass = UnkennyChatMessage;
}

export { modifyUnkennyChatData, overwriteChatMessage, processUnKennyResponseData, triggerResponse, unkennyResponseFlag };

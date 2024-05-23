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
            speaker: {
                actor: actor.id,
                alias: actor.name
            }
        };
        ui.chat.processMessage(unkennyResponseFlag + JSON.stringify(chatData));
    } else {
        ui.notifications.error("No response generated.");
    }
}

function processUnKennyResponseData(data) {
    if (data.content.startsWith(unkennyResponseFlag)) {
        const jsonString = data.content.replace(unkennyResponseFlag, "");
        let chatDataJson;
        try {
            chatDataJson = JSON.parse(jsonString);
        } catch (error) {
            ui.notifications.error("Error parsing JSON: " + error);
            return;
        }
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
            processUnKennyResponseData(data);
            for (let key in data) {
                this[key] = data[key] ?? this[key]; //TODO: This still does not render the ator token and set the speaker name.
            }
            await super._preCreate(data, options, user);
        }
    }
    CONFIG.ChatMessage.documentClass = UnkennyChatMessage;
}

export { modifyUnkennyChatData, overwriteChatMessage, processUnKennyResponseData, triggerResponse, unkennyResponseFlag };

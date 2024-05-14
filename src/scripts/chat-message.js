import { replaceAlias } from "./chat-message-parsing.js";
import { generateResponse } from "./llm.js";

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
        new ChatLog().processMessage("#TeamEmilia" + JSON.stringify(chatData));

        //Hooks.call('chatMessage', response, chatData);
    } else {
        ui.notifications.error("No response generated.");
    }
}

export { modifyUnkennyChatData, triggerResponse };

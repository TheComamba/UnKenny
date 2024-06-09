import { findAdressedActor, modifyUnkennyChatData } from "./chat-message-request.js";
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
        const actorId = source.speaker.actor;
        if (actorId) {
            smuggleConversationWithFlagIntoSource(source, actorId);
        }
    }
}

// TODO move to own file.
function smuggleConversationWithFlagIntoSource(source, actorId) {
    if (!source.hasOwnProperty('flags')) {
        source.flags = new Collection();
    }
    if (!source.flags.has('unkenny')) {
        source.flags.set('unkenny', new Collection());
    }
    source.flags.get('unkenny').set("conversationWith", actorId);
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

        /** @override */
        async _preCreate(data, options, user) {
            let actor = await findAdressedActor(data.content);
            if (actor) {
                await modifyUnkennyChatData(this._source, actor);
                smuggleConversationWithFlagIntoSource(this._source, actor.id);
                triggerResponse(actor, this._source.content);
            }
            await super._preCreate(data, options, user);
        }
    }
    CONFIG.ChatMessage.documentClass = UnkennyChatMessage;
}

export { overwriteChatMessage, postResponse, processUnKennyResponse, triggerResponse, unkennyResponseFlag };

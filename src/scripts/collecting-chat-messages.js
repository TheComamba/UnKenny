import { findAdressedActor } from "./chat-message-request.js";
import { processUnKennyResponse, triggerResponse } from "./chat-message-response.js";
import { getTokenLimit } from "./models.js";
import { roughNumberOfTokensForOpenAi } from "./openai-api.js";

const CONVERSATION_FLAG = "conversationWith";

async function collectPreviousMessages(actor) {
    const messages = await Promise.all(game.messages.contents.map(async (m) => {
        const flag = await m.getFlag('unkenny', CONVERSATION_FLAG);
        return flag === actor.id ? m : null;
    }));

    return messages.filter(m => m !== null);
}

function sortMessages(messages) {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
}

function shortenMessagesByOne(messages) {
    for (let i = 0; i < messages.length - 2; i++) {
        if (messages[i].role != 'system') {
            messages.splice(i, 1);
            return;
        }
    }

    const errorMessage = game.i18n.localize('unkenny.chatMessage.preambleTooLong');
    ui.notifications.error(errorMessage);
    messages.length = 0;
}

async function truncateMessages(model, messages, newTokenLimit) {
    const warningMessage = game.i18n.format("unkenny.chatMessage.truncatingMessage", { messageCount: messages.length - 1 });
    const limit = getTokenLimit(model) - newTokenLimit;
    const messageSize = roughNumberOfTokensForOpenAi(messages);
    if (messageSize > limit) {
        ui.notifications.warn(warningMessage);
    }
}

async function messagesOrganisedForTemplate(actor, previousMessages, newMessageContent) {
    const preamble = await actor.getFlag('unkenny', 'preamble');
    if (!preamble) {
        const errorMessage = game.i18n.format('unkenny.chatMessage.noPreamble', { name: actor.name });
        ui.notifications.error(errorMessage);
        return [];
    }

    let messages = [];
    messages.push({
        role: 'system',
        content: preamble
    });
    previousMessages.forEach((message) => {
        let role = 'user';
        const speaker = message._source.speaker;
        if (speaker && speaker.actor === actor.id) {
            role = 'assistant';
        }
        messages.push({
            role: role,
            content: message.content
        });
    });
    messages.push({
        role: 'user',
        content: newMessageContent
    });
    return messages;
}

async function collectChatMessages(actor, newMessageContent, newTokenLimit) {
    let previousMessages = await collectPreviousMessages(actor);
    sortMessages(previousMessages);
    let messages = await messagesOrganisedForTemplate(actor, previousMessages, newMessageContent);
    truncateMessages(actor, messages, newTokenLimit);
    return messages;
}

function smuggleConversationWithFlagIntoSource(source, actorId) {
    if (!source['flags']) {
        source.flags = {};
    }
    if (!source.flags['unkenny']) {
        source.flags['unkenny'] = {};
    }
    source.flags['unkenny'][CONVERSATION_FLAG] = actorId;
}

function getConversationWithFlagSync(message) {
    return message?.flags?.unkenny ? message.flags.unkenny[CONVERSATION_FLAG] : undefined;
}

async function removeMessageFromUnKennyConversation(message) {
    await message.unsetFlag('unkenny', CONVERSATION_FLAG);
}

function removeAllMessagesFromUnKennyConversation(messages) {
    messages.forEach((message) => {
        removeMessageFromUnKennyConversation(message);
    });
}

function classContainsUnKennyChatMessage(chatMessageClass) {
    let currentClass = chatMessageClass;
    while (currentClass) {
        if (currentClass.name === 'UnKennyChatMessage') {
            return true;
        }
        currentClass = Object.getPrototypeOf(currentClass);
    }
    return false;
}

function overwriteChatMessage() {
    const currentChatMessage = CONFIG.ChatMessage.documentClass;
    if (classContainsUnKennyChatMessage(currentChatMessage)) {
        return;
    }
    class UnKennyChatMessage extends currentChatMessage {
        /** @override */
        _initialize(options = {}) {
            processUnKennyResponse(this);
            super._initialize(options);
        }

        /** @override */
        async _preCreate(data, options, user) {
            let actor = await findAdressedActor(data.content);
            if (actor) {
                smuggleConversationWithFlagIntoSource(this._source, actor.id);
                triggerResponse(actor, this._source.content);
            }
            await super._preCreate(data, options, user);
        }
    }
    CONFIG.ChatMessage.documentClass = UnKennyChatMessage;
}

export {
    CONVERSATION_FLAG,
    classContainsUnKennyChatMessage,
    collectChatMessages,
    collectPreviousMessages,
    getConversationWithFlagSync,
    messagesOrganisedForTemplate,
    overwriteChatMessage,
    removeAllMessagesFromUnKennyConversation,
    removeMessageFromUnKennyConversation,
    smuggleConversationWithFlagIntoSource,
    sortMessages,
    truncateMessages
};

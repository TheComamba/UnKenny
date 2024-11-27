import { findAdressedActor } from "./chat-message-request.js";
import { processUnKennyResponse, triggerResponse } from "./chat-message-response.js";
import { numberOfTokensForLocalLLM } from "./local-llm.js";
import { getTokenLimit, isLocal } from "./models.js";
import { roughNumberOfTokensForOpenAi } from "./openai-api.js";

const CONVERSATION_FLAG = "conversationWith";

async function collectPreviousMessages(actor) {
    const messages = game.messages.contents.filter(m => {
        // Check for conversation flag
        const flag = m.flags?.unkenny?.[CONVERSATION_FLAG];
        const isInConversation = flag === actor.id;
        
        // Check if it's a response from this actor
        const isActorResponse = m.speaker?.actor === actor.id && 
                              m.flags?.unkenny?.responseData;
        
        // Debug log to help track message processing
        console.log("Message check:", {
            message: m,
            flag,
            isInConversation,
            isActorResponse,
            speaker: m.speaker,
            flags: m.flags
        });
        
        return isInConversation || isActorResponse;
    });

    return messages;
}

function sortMessages(messages) {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
}

async function isContextTooLongForLocalModel(model, messages, tokenLimit) {
    let tokenCount = await numberOfTokensForLocalLLM(model, messages);
    return tokenCount > tokenLimit;
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
    if (!messages || !messages.length) return messages;
    
    const warningMessage = game.i18n.format("unkenny.chatMessage.truncatingMessage", { messageCount: messages.length - 1 });
    let warningHasBeenGiven = false;
    const limit = getTokenLimit(model) - newTokenLimit;
    
    if (isLocal(model)) {
        while (await isContextTooLongForLocalModel(model, messages, limit)) {
            if (!warningHasBeenGiven) {
                ui.notifications.warn(warningMessage);
                warningHasBeenGiven = true;
            }
            // Keep system message, remove oldest non-system message
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].role !== 'system') {
                    messages.splice(i, 1);
                    break;
                }
            }
        }
    } else {
        const messageSize = roughNumberOfTokensForOpenAi(messages);
        if (messageSize > limit) {
            ui.notifications.warn(warningMessage);
            // Remove messages until we're under the limit
            while (messages.length > 2 && roughNumberOfTokensForOpenAi(messages) > limit) {
                // Keep system message and last user message
                messages.splice(1, 1);
            }
        }
    }
    
    return messages;
}

function messagesOrganisedForTemplate(messages, preamble, parameters, actor) {
    // Ensure preamble is a string
    preamble = preamble?.toString() || '';
    
    // Check if we have either preamble or biography
    const hasPreamble = preamble.trim().length > 0;
    const hasBiography = parameters?.includeBiography && parameters?.biography && parameters.biography.toString().trim().length > 0;
    
    if (!hasPreamble && !hasBiography) {
        throw new Error(game.i18n.localize("unkenny.chatMessage.noPreambleOrBio"));
    }

    let result = [];
    
    // Add system message with preamble and/or biography
    let systemContent = "";
    if (hasPreamble) {
        systemContent += preamble.trim();
    }
    if (hasBiography) {
        if (systemContent) {
            systemContent += "\n\n";
        }
        systemContent += parameters.biography.toString().trim();
    }
    
    if (systemContent) {
        result.push({
            role: 'system',
            content: systemContent
        });
    }
    
    // Add previous messages in chronological order
    if (messages && messages.length > 0) {
        messages.forEach(message => {
            const isAssistantMessage = message.speaker?.actor === actor.id && 
                                     message.flags?.unkenny?.responseData;
            
            let messageContent = (isAssistantMessage ? 
                message.flags?.unkenny?.responseData : 
                message.content).replace(/<br\s*\/?>/g, '\n').replace(/@\w+\s/, ''); // Remove @alias prefix
            
            // Add speaker name for user messages
            if (!isAssistantMessage && message.speaker?.alias) {
                messageContent = `${message.speaker.alias}: ${messageContent}`;
            }
            
            // Debug log for message processing
            console.log("Processing message for template:", {
                isAssistant: isAssistantMessage,
                content: messageContent,
                originalMessage: message
            });
            
            result.push({
                role: isAssistantMessage ? 'assistant' : 'user',
                content: messageContent
            });
        });
    }
    
    return result;
}

async function collectChatMessages(actor, newMessageContent, newTokenLimit, parameters) {
    // Get previous messages and sort them by timestamp
    let previousMessages = await collectPreviousMessages(actor);
    previousMessages = sortMessages(previousMessages);
    
    // Get preamble
    let preamble = await actor.getFlag("unkenny", "preamble") || "";
    
    // Format messages with proper roles (including AI responses)
    let messages = messagesOrganisedForTemplate(previousMessages, preamble, parameters, actor);
    
    // Add the new message last
    messages.push({
        role: 'user',
        content: newMessageContent
    });
    
    // Debug log to check message history
    console.log("Message history before truncation:", JSON.stringify(messages, null, 2));
    
    // Truncate if needed
    await truncateMessages(parameters.model, messages, newTokenLimit);
    
    // Debug log to check final messages
    console.log("Final message history:", JSON.stringify(messages, null, 2));
    
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
    try {
        console.log("Attempting to remove flags from message:", {
            messageId: message.id,
            content: message.content,
            currentFlags: message.flags,
            speaker: message.speaker
        });

        await message.update({
            "flags.unkenny.-=responseData": null,
            [`flags.unkenny.-=${CONVERSATION_FLAG}`]: null
        });

        console.log("Flags removed successfully from message:", message.id);
    } catch (error) {
        console.error("Error removing flags from message:", {
            messageId: message.id,
            error: error,
            flags: message.flags
        });
    }
}

async function removeAllMessagesFromUnKennyConversation(messages) {
    console.log("Starting removeAllMessagesFromUnKennyConversation with messages:", messages);

    if (!messages || !messages.length) {
        console.log("No messages provided to remove");
        return;
    }

    try {
        // Get the actor ID from the first message that has either flag
        let actorId;
        for (const msg of messages) {
            if (msg.flags?.unkenny?.[CONVERSATION_FLAG]) {
                actorId = msg.flags.unkenny[CONVERSATION_FLAG];
                break;
            }
            if (msg.speaker?.actor && msg.flags?.unkenny?.responseData) {
                actorId = msg.speaker.actor;
                break;
            }
        }

        console.log("Found actor ID:", actorId);

        if (!actorId) {
            console.log("No actor ID found in messages");
            return;
        }

        // Get ALL messages and manually check each one
        const allMessages = game.messages.contents;
        console.log("Total messages in game:", allMessages.length);

        for (const message of allMessages) {
            // Check for either the conversation flag or if it's a response from this actor
            const hasConversationFlag = message.flags?.unkenny?.[CONVERSATION_FLAG] === actorId;
            const isActorMessage = message.speaker?.actor === actorId;
            const hasResponseData = !!message.flags?.unkenny?.responseData;
            const isActorResponse = message.content.startsWith("/talk") && isActorMessage;

            console.log("Checking message:", {
                id: message.id,
                content: message.content,
                hasConversationFlag,
                isActorMessage,
                hasResponseData,
                isActorResponse,
                flags: message.flags,
                speaker: message.speaker
            });

            // Include message if it has the conversation flag OR if it's from the actor AND (has response data OR starts with /talk)
            if (hasConversationFlag || (isActorMessage && (hasResponseData || isActorResponse))) {
                console.log("Found message to remove:", message.id);
                await removeMessageFromUnKennyConversation(message);
                console.log("Message processed:", message.id);
            }
        }

        console.log("Finished processing all messages");

    } catch (error) {
        console.error("Error in removeAllMessagesFromUnKennyConversation:", {
            error: error,
            messages: messages
        });
        ui.notifications.error("Failed to remove conversation flags");
    }
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

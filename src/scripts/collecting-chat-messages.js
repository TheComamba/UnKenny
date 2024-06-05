
function collectPreviousMessages(actor) {
    const condition = (m) => m.getFlag('unkenny', 'conversationWith') === actor.id;
    return Array.from(game.messages).filter(condition);
}

function sortMessages(messages) {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
}

function messagesOrganisedForTemplate(actor, previousMessages, newMessageContent) {
    let messages = [];
    messages.push({
        role: 'system',
        content: actor.getFlag('unkenny', 'preamble')
    });
    previousMessages.forEach((message) => {
        let role = 'user';
        const speaker = message.data.speaker;
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

function collectChatMessages(actor, newMessageContent) {
    let previousMessages = collectPreviousMessages(actor);
    sortMessages(previousMessages);
    return messagesOrganisedForTemplate(actor, previousMessages, newMessageContent);
}

export { collectChatMessages, collectPreviousMessages, sortMessages, messagesOrganisedForTemplate };

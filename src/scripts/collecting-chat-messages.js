
function collectPreviousMessages(actor) {
    const condition = (m) => m.getFlag('unkenny', 'conversationWith') === actor.id;
    return Array.from(game.messages).filter(condition);
}

function sortMessages(messages) {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
}

// TODO: We need a function to truncate the messages for the local models.
// TODO: Note that the entire context includes the generated output.
// TODO: Note also that it is measured in tokens, not characters.
// TODO: When truncating, a notification should appear.
// TODO: If preamble and prompt are already too long, an error message should appear and the process should fail.

function isContextTooLong(messages, tokenLimit) {
 // TODO
}

function truncateMessages() {

}

function messagesOrganisedForTemplate(actor, previousMessages, newMessageContent) {
    if (!actor.getFlag('unkenny', 'preamble')) {
        ui.notifications.error('No preamble set for actor ' + actor.name + '.');
        return [];
    }

    let messages = [];
    messages.push({
        role: 'system',
        content: actor.getFlag('unkenny', 'preamble')
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

function collectChatMessages(actor, newMessageContent) {
    let previousMessages = collectPreviousMessages(actor);
    sortMessages(previousMessages);
    return messagesOrganisedForTemplate(actor, previousMessages, newMessageContent);
}

export { collectChatMessages, collectPreviousMessages, messagesOrganisedForTemplate, sortMessages, truncateMessages };

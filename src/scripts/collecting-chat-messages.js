
function collectPreviousMessages(actor) {
    const condition = (m) => m.getFlag('unkenny', 'conversationWith') === actor.id;
    return Array.from(game.messages).filter(condition);
}

function sortMessages(messages) {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
}

// function getMessages(parameters, input) {
//     return [
//         {
//             role: 'system',
//             content: parameters.preamble,
//         },
//         {
//             role: 'user',
//             content: input,
//         }
//     ];
// }

function messagesOrganisedForTemplate(actor, previousMessages, newMessageContent) {

}

function collectChatMessages(actor, newMessageContent) {
    let previousMessages = collectPreviousMessages(actor);
    sortMessages(previousMessages);
    return messagesOrganisedForTemplate(actor, previousMessages, newMessageContent);
}

export { collectChatMessages, collectPreviousMessages, sortMessages, messagesOrganisedForTemplate };


function collectPreviousMessages(actor) {

}

function sortMessages(messages) {

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

export { collectChatMessages, collectPreviousMessages, sortMessages, messagesOrganisedForTemplate};

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
            speaker: { actor: actor.id }
        };
        Hooks.call('chatMessage', chatLog, message, chatData);
    } else {
        ui.notifications.error("No response generated.");
    }
}

export { modifyUnkennyChatData, triggerResponse };

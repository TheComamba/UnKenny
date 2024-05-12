function postInChat(originator, message) {
    let chatData = {
        content: message,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER
    }
    if (typeof originator === 'string') {
        chatData["user"] = originator;
    } else if (originator instanceof Actor) {
        chatData["speaker"] = { actor: originator.id };
    } else {
        ui.notifications.error("Message originator has unkown type.");
    }

    ChatMessage.create(chatData);
}

function isUnkenny(actor) {
    if (!actor) {
        ui.notifications.error("Unkennyness checked for null actor.");
        return false;
    }
    let alias = actor.getFlag("unkenny", "alias");
    return !!alias;
}

export { isUnkenny, postInChat };

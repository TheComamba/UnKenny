function postInChat(originator, message) {
    let chatData = {
        content: message,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER
    }
    if (originator instanceof User) {
        chatData["user"] = originator.id;
    } else if (originator instanceof Actor) {
        chatData["speaker"] = { actor: originator.id };
    } else {
        ui.notifications.error("Message originator has unkown type.");
    }

    let wasMessagePosted = !Hooks.call("chatMessage", this, message, chatData)
    if (!wasMessagePosted) {
        ChatMessage.create(chatData);
    }
}

function isUnkenny(actor) {
    if (!actor) {
        ui.notifications.error("Unkennyness checked for null actor.");
        return false;
    }
    let preamble = actor.getFlag("unkenny", "preamble");
    return !!preamble;
}

export { isUnkenny, postInChat };
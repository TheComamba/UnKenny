function postInChat(originator, text) {
    let params = {
        content: text,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER
    }
    if (originator instanceof User) {
        params["user"] = originator.id;
    } else if (originator instanceof Actor) {
        params["speaker"] = { actor: originator.id };
    } else {
        ui.notifications.error("Message originator has unkown type.");
    }
    ChatMessage.create(params);
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
function postInChat(actor, text) {
    let params = {
        content: text,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        user: actor.id,
        speaker: actor.id
    }
    ChatMessage.create(params);
}

function isUnkenny(actor) {
    if (!actor) {
        return false;
    }
    let preamble = actor.getFlag("unkenny", "preamble");
    return !!preamble;
}

export { isUnkenny, postInChat };
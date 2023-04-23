function postInChat(actor, text) {
    let params = {
        content: `<p><b>${actor.name}:</b></p><p>${text}</p>`,
        type: 1,
        user: actor.id
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
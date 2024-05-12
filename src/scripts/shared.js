function isUnkenny(actor) {
    if (!actor) {
        ui.notifications.error("Unkennyness checked for null actor.");
        return false;
    }
    let alias = actor.getFlag("unkenny", "alias");
    return !!alias;
}

async function loadExternalModule(name, version) {
    try {
        return await import('https://cdn.jsdelivr.net/npm/' + name + '@' + version);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
            try {
                return await import(name);
            } catch (localError) {
                throw new Error("Unable to load local module " + name + ": " + localError);
            }
        } else {
            throw new Error("Unable to load module: " + error);
        }
    }
}

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

export { isUnkenny, loadExternalModule, postInChat };

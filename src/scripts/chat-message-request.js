function findAdressedAlias(message) {
    if (!message) {
        return null;
    }
    const regex = /@(\w+)/;
    const match = message.match(regex);
    return match ? match[1].toLowerCase() : null;
}

function replaceAlias(message, alias, actorName) {
    if (!message || !alias || !actorName) {
        return message;
    }
    const aliasReplacement = new RegExp("@" + alias, "gi");
    message = message.replace(aliasReplacement, "<b>" + actorName + "</b>");
    message = message.trim();
    return message;
}

async function actorHasAlias(actor, alias) {
    if (typeof alias !== 'string' || typeof actor !== 'object' || actor === null) {
        console.error('actorHasAlias called with invalid arguments');
        return false;
    }

    if (!alias) {
        return false;
    }

    const lowerCaseAlias = alias.toLowerCase();
    const actorAlias = (await actor.getFlag("unkenny", "alias") ?? "").toLowerCase();

    return actorAlias === lowerCaseAlias;
}

async function findAdressedActor(message) {
    let alias = findAdressedAlias(message);
    if (!alias) {
        return null
    }
    let actor = await findActorWithAlias(alias);
    if (!actor) {
        ui.notifications.error(`Actor with alias "${alias}" not found.`);
        return null;
    }
    return actor;
}

async function findActorWithAlias(alias) {
    for (let actor of game.actors) {
        if (await actorHasAlias(actor, alias)) {
            return actor;
        }
    }
    return null;
}


async function modifyUnkennyChatData(chatData, addressedActor) {
    let name = addressedActor.name;
    let alias = await addressedActor.getFlag("unkenny", "alias");
    chatData.content = replaceAlias(chatData.content, alias, name);
}

export { actorHasAlias, findAdressedActor, modifyUnkennyChatData, replaceAlias, findAdressedAlias };

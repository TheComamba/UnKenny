function findAdressedAlias(message) {
    if (!message) {
        return null;
    }
    const regex = /@(\w+)/;
    const match = message.match(regex);
    return match ? match[1].toLowerCase() : null;
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

export { actorHasAlias, findAdressedActor, findAdressedAlias };

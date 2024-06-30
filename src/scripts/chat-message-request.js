function findAdressedAlias(message) {
    if (!message || typeof message !== 'string') {
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
    const actorsWithAlias = [];
    for (let actor of game.actors) {
        if (await actorHasAlias(actor, alias)) {
            actorsWithAlias.push(actor);
        }
    }
    if (actorsWithAlias.length === 0) {
        return null;
    } else if (actorsWithAlias.length === 1) {
        return actorsWithAlias[0];
    } else {
        const actorNames = actorsWithAlias.map(actor => actor.name);
        ui.notifications.error(`Multiple actors with alias "${alias}" found: ${actorNames.join(", ")}`);
        return null;
    }
}

export { actorHasAlias, findActorWithAlias, findAdressedActor, findAdressedAlias };

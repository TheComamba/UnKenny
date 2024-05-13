import { isUnkenny } from "./shared.js";

function findAdressedAlias(message) {
    const regex = /@(\w+)/;
    const match = message.match(regex);
    return match ? match[1].toLowerCase() : null;
}

function replaceAlias(message, alias, actorName) {
    if (alias == "") {
        return message;
    }
    const aliasReplacement = new RegExp("@" + alias, "gi");
    message = message.replace(aliasReplacement, "<b>" + actorName + "</b>");
    message = message.trim();
    return message;
}

function actorHasAlias(actor, alias) {
    if (typeof alias !== 'string' || typeof actor !== 'object' || actor === null) {
        console.error('actorHasAlias called with invalid arguments');
        return false;
    }

    if (!alias) {
        return false;
    }

    const lowerCaseAlias = alias.toLowerCase();
    const actorAlias = (actor.getFlag("unkenny", "alias") ?? "").toLowerCase();

    return actorAlias === lowerCaseAlias;
}

function findAdressedActor(message) {
    let alias = findAdressedAlias(message);
    if (!alias) {
        return null
    }
    let actor = game.actors.find(actor => actorHasAlias(actor, alias));
    if (!actor) {
        ui.notifications.error(`Actor with alias "${alias}" not found.`);
        return null;
    }
    return actor;
}

export { findAdressedActor, replaceAlias, findAdressedAlias, actorHasAlias };

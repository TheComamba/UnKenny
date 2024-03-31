import { isUnkenny } from "./shared.js";

function findAdressedAlias(message) {
    const regex = /(?:^\/|@)(\w+)/;
    const match = message.match(regex);
    return match ? match[1].toLowerCase() : null;
}

function replaceAlias(message, alias, actorName) {
    if (alias == "") {
        return message;
    }
    const aliasAtBeginning = new RegExp("^/" + alias, "i");
    const aliasAnywhere = new RegExp("@" + alias, "gi");
    message = message.replace(aliasAtBeginning, '');
    message = message.replace(aliasAnywhere, "<b>" + actorName + "</b>");
    return message;
}

function findAdressedActor(message) {
    let alias = findAdressedAlias(message);
    if (!alias) {
        return null
    }
    let actor = game.actors.find(actor => actorHasName(actor, alias));
    if (!actor) {
        ui.notifications.error(`Actor "${alias}" not found.`);
        return null;
    }
    if (!isUnkenny(actor)) {
        ui.notifications.error(`Actor "${alias}" is not UnKenny.`);
        return null;
    }
    return actor;
}

function actorHasName(actor, name) {
    if (!name || name == "") {
        return false;
    }
    name = name.toLowerCase();

    let actorName = actor.name || "";
    actorName = actorName.toLowerCase();

    let actorAlias = actor.getFlag("unkenny", "alias") || "";
    actorAlias = actorAlias.toLowerCase();

    return actorName == name || actorAlias == name
}

export { findAdressedActor, replaceAlias };
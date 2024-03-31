import { isUnkenny } from "./shared.js";

const OPEN_BRACE = "("
const CLOSE_BRACE = ")";
const MARKER = "@" + OPEN_BRACE;
const BEGINNING_MARKER = "/" + OPEN_BRACE;

function findAdressedActorName(message) {
    let braceDepth = 0;

    let startIndex = message.indexOf(BEGINNING_MARKER);
    if (startIndex != 0) {
        startIndex = message.indexOf(MARKER);
    }
    if (startIndex == -1) {
        return null;
    }

    if (startIndex == 0) {
        startIndex += BEGINNING_MARKER.length;
    } else {
        startIndex += MARKER.length;
    }
    braceDepth += 1;

    let endIndex = startIndex;
    while (braceDepth > 0) {
        let nextOpenBrace = message.indexOf(OPEN_BRACE, endIndex);
        let nextCloseBrace = message.indexOf(CLOSE_BRACE, endIndex);
        if (nextOpenBrace != -1 && nextOpenBrace < nextCloseBrace) {
            // The next interesting marker is an opening bracket.
            braceDepth += 1;
            endIndex = nextOpenBrace + OPEN_BRACE.length;
        } else if (nextCloseBrace != -1) {
            // The next interesting marker is a closing bracket.
            braceDepth -= 1;
            endIndex = nextCloseBrace + CLOSE_BRACE.length;
        } else {
            ui.notifications.error("It looks like you are trying to talk to an UnKenny actor, but the name delimeter is never closed.");
            return null;
        }
    }
    endIndex -= CLOSE_BRACE.length;
    let actorName = message.substring(startIndex, endIndex);
    if (actorName != "") {
        return actorName;
    } else {
        return null;
    }
}

function replaceActorNames(message, alias, actorName) {
    if (alias == "") {
        return message;
    }
    const beginningReplacement = BEGINNING_MARKER + alias + CLOSE_BRACE;
    const replacement = MARKER + alias + CLOSE_BRACE;
    if (message.indexOf(beginningReplacement) != -1) {
        message = message.substring(beginningReplacement.length);
    }
    let pos = message.indexOf(replacement);
    while (pos != -1) {
        message = message.substring(0, pos) + "<b>" + actorName + "</b>" + message.substring(pos + replacement.length);
        pos = message.indexOf(replacement);
    }
    return message;
}

function findAdressedActor(message) {
    let actorName = findAdressedActorName(message);
    if (!actorName) {
        return null
    }
    let actor = game.actors.find(actor => actorHasName(actor, actorName));
    if (!actor) {
        ui.notifications.error(`Actor "${actorName}" not found.`);
        return null;
    }
    if (!isUnkenny(actor)) {
        ui.notifications.error(`Actor "${actorName}" is not UnKenny.`);
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

export { findAdressedActor, replaceActorNames };
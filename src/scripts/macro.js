import { isUnkenny } from "./shared.js";

function findAdressedActorName(message) {
    const OPEN_BRACE = "("
    const CLOSE_BRACE = ")";
    const MARKER = "@" + OPEN_BRACE;
    const BEGINNING_MARKER = "/" + OPEN_BRACE;
    let braceDepth = 0;

    let startIndex = message.indexOf(BEGINNING_MARKER);
    if (startIndex != 0) {
        startIndex = message.indexOf(MARKER);
    }
    if (startIndex == -1) {
        return null;
    }

    startIndex += BEGINNING_MARKER.length;
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
    return message.substring(startIndex, endIndex);
}

function findAdressedActor(message) {
    let actorName = findAdressedActorName(message);
    if (!actorName) {
        return null
    }
    let actor = game.actors.find(actor => actor.name == actorName);
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

export { findAdressedActor };
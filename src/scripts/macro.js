import { isUnkenny } from "./shared.js";

function findAdressedActor(message) {
    const BEGINNING = "@";
    const POSSIBLE_ENDINGS = [" ", ":", ",", ".", "!", "?", "\n"];
    let startIndex = message.indexOf(BEGINNING);
    if (startIndex == -1) {
        return null;
    }
    startIndex += BEGINNING.length;
    let endIndex = -1;
    for (let ending of POSSIBLE_ENDINGS) {
        let index = message.indexOf(ending, startIndex);
        if (index != -1 && (endIndex == -1 || index < endIndex)) {
            endIndex = index;
        }
    }
    if (endIndex == -1) {
        return null
    }
    let actorName = message.substring(startIndex, endIndex);
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
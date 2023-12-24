import { UnKennyChat } from "../apps/unkenny-chat.js";
import { isUnkenny } from "./shared.js";

function executeUnKennyMacro(macro) {
    let actor = macroToActor(macro);
    if (actor) {
        new UnKennyChat(actor).render(true);
    } else {
        ui.notifications.error("Corresponding actor not found.");
    }
}

function getMacroParameters(actor) {
    return {
        command: "const api = game.modules.get('unkenny').api; api.executeUnKennyMacro(this);",
        img: actor.img,
        name: `Speak with ${actor.name}`,
        type: "script"
    };
}

async function updateMacro(actor) {
    let macro = actorToMacro(actor)
    if (isUnkenny(actor)) {
        let params = getMacroParameters(actor)
        if (!macro) {
            macro = await Macro.create(params);
        } else {
            macro.update(params);
        }
        macro.setFlag("unkenny", "actor_id", actor.id);
    } else {
        if (macro) {
            macro.delete();
        }
    }
}

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

function actorToMacro(actor) {
    return game.macros.find(macro => macro.getFlag("unkenny", "actor_id") == actor.id);
}

function macroToActor(macro) {
    return game.actors.find(actor => macro.getFlag("unkenny", "actor_id") == actor.id);
}

export { actorToMacro, executeUnKennyMacro, findAdressedActor, updateMacro };
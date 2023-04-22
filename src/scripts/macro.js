import { isUnkenny } from "./unkenny.js";
import { respondInChat } from "./chat.js";

function executeUnKennyMacro(macro) {
    let actor = macroToActor(macro);
    respondInChat(actor, "Some response.");
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

function actorToMacro(actor) {
    return game.macros.find(macro => macro.getFlag("unkenny", "actor_id") == actor.id);
}

function macroToActor(macro) {
    return game.actors.find(actor => macro.getFlag("unkenny", "actor_id") == actor.id);
}

export { actorToMacro, executeUnKennyMacro, updateMacro };
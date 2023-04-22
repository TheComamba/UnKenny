function isUnkenny(actor) {
    if (!actor) {
        return false;
    }
    let preamble = actor.getFlag("unkenny", "preamble");
    return !!preamble;
}

function getMacroParameters(actor) {
    return {
        command: "console.log('testikus maximus')",
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

export { actorToMacro, isUnkenny, updateMacro };
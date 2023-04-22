function isUnkenny(actor) {
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

async function generateMacro(actor) {
    if (!actorToMacro(actor)) {
        let input = getMacroParameters(actor)
        let macro = await Macro.create(input);
        macro.setFlag("unkenny", "actor_id", actor.id);
    }
}

function actorToMacro(actor) {
    return game.macros.find(macro => macro.getFlag("unkenny", "actor_id") == actor.id);
}

export { isUnkenny, generateMacro };
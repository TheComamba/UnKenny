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

function generateMacro(actor) {
    let input = getMacroParameters(actor)
    Macro.create(input);
}

export { isUnkenny, generateMacro };
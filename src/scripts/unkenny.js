function isUnkenny(actor) {
    let preamble = actor.getFlag("unkenny", "preamble");
    return !!preamble;
}

function generateMacroName(actor) {
    return "testKenny"
}

function generateMacro(actor) {
    let input = {
        command: "console.log('testikus maximus')",
        img: "icons/svg/dice-target.svg",
        name: generateMacroName(actor),
        type: "script"
    }
    Macro.create(input);
}

export { isUnkenny, generateMacro };
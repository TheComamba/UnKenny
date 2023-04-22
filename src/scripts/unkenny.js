function isUnkenny(actor) {
    if (!actor) {
        return false;
    }
    let preamble = actor.getFlag("unkenny", "preamble");
    return !!preamble;
}

export { isUnkenny };
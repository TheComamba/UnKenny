export default function isUnkenny(actor) {
    let preamble = actor.getFlag("unkenny", "preamble");
    return !!preamble;
}
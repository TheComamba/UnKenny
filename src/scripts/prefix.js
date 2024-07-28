async function prefixResponse(actor, response) {
    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk") || false;
    if (prefixWithTalk) {
        response = "/talk " + response;
    }
    return response;
}

export { prefixResponse };

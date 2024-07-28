async function prefixResponse(response, parameters) {
    if (parameters.prefixWithTalk) {
        response = "/talk " + response;
    }
    return response;
}

export { prefixResponse };

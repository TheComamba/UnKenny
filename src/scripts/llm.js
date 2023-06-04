const SERVER_URL = "http://127.0.0.1:23308";

function generateResponse(actor, input) {
    const preamble = "TODO";
    postRequest(JSON.stringify({
        preamble: preamble,
        input: input
    })).then(response => {
        console.log(response);
    });
    return "[Some response]";
}

function postRequest(body) {
    return fetch(SERVER_URL, {
        method: "POST",
        body: body
    }).then(response => response.json());
}

export { generateResponse };
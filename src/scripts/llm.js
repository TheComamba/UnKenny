import { ServerNotRunningDialog } from "../apps/start_server.js";

const SERVER_URL = "http://127.0.0.1:23308";

async function generateResponse(actor, input) {
    const preamble = actor.getFlag("unkenny", "preamble");
    return postRequest(JSON.stringify({
        preamble: preamble,
        input: input
    })).then(response => {
        console.log(response);
    }).catch(error => {
        new ServerNotRunningDialog().render(true);
        return "[Server unavailable]";
    });
}

async function postRequest(body) {
    const response = await fetch(SERVER_URL + "/predict", {
        method: "POST",
        mode: "no-cors",
        body: body
    });
    return await response.json();
}

export { generateResponse };
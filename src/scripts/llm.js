import { getResponseFromLocalLLM } from "../scripts/local-llm.js";
import { getResponseFromOpenAI } from "../scripts/openai-api.js";
import { postInChat } from "../scripts/shared.js";

async function generateResponse(actor, input) {
    let response;
    let llmType = await actor.getFlag("unkenny", "llmType")
    if (llmType == 'api') {
        response = await getResponseFromOpenAI(actor, input);
    } else if (llmType == 'local') {
        response = await getResponseFromLocalLLM(actor, input);
    } else {
        ui.notifications.error("The selected model has neither the local nor the api property.");
        return;
    }

    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk") || false;
    if (prefixWithTalk) {
        response = "/talk " + response;
    }

    return response;
}

async function postResponse(actor, request) {
    let response = null;
    try {
        response = await generateResponse(actor, request);
    } catch (error) {
        ui.notifications.error(error);
    }
    if (response) {
        postInChat(actor, response);
    } else {
        ui.notifications.error("No response generated.");
    }
}

export { postResponse, generateResponse };
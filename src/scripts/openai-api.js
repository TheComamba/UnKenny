import OpenAi from 'https://cdn.jsdelivr.net/npm/openai@4.22.1/+esm'



async function getResponseAPI(actor, input) {
    const openai = new OpenAi({
        apiKey: await actor.getFlag("unkenny", "llmAPIKey"),
        dangerouslyAllowBrowser: true,
    })

    let modelPath = await actor.getFlag("unkenny", "model");
    if (!modelPath) {
        ui.notifications.error("Please select a model in the actor sheet.");
        return;
    }

    let maxNewTokens = await actor.getFlag("unkenny", "maxNewTokens");
    if (!maxNewTokens) {
        ui.notifications.error("Please set a maximum number of new tokens in the actor sheet.");
        return;
    }

    let preamble = await actor.getFlag("unkenny", "model");
    if (!modelPath) {
        ui.notifications.error("Please select a model in the actor sheet.");
        return;
    }

    const chatCompletion = await openai.chat.completions.create({
        model: modelPath,
        messages: [
            {
                role: 'system',
                content: preamble,
            },
            {
                role: 'user',
                content: input,
            }
        ],
        temperature: 0,
        max_tokens: maxNewTokens,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    });

    return chatCompletion['choices'][0]['message']['content'];
}

export { getResponseAPI };
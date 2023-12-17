import OpenAi from 'https://cdn.jsdelivr.net/npm/openai@4.22.1/+esm'



async function generateResponseApi(actor, input) {
    const openai = new OpenAi({
        apiKey: await actor.getFlag("unkenny", "llmAPIKey"),
        dangerouslyAllowBrowser: true,
    })

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: await actor.getFlag("unkenny", "preamble"),
            },
            {
                role: 'user',
                content: input,
            }
        ],
        temperature: 0,
        max_tokens: await actor.getFlag("unkenny", "maxNewTokens"),
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    });

    return chatCompletion['choices'][0]['message']['content'];
}

export { generateResponseApi };
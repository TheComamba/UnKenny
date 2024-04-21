let OpenAi;

import('https://cdn.jsdelivr.net/npm/openai@4.22.1/+esm')
    .then(module => {
        OpenAi = module.default;
    })
    .catch(error => {
        if (process.env.NODE_ENV === 'test') {
            // Maybe add a mock here
        } else {
            console.error("Unable to load module", error);
        }
    });

async function getResponseFromOpenAI(parameters, input) {
    const openai = new OpenAi({
        apiKey: parameters.apiKey,
        dangerouslyAllowBrowser: true,
    });

    const chatCompletion = await openai.chat.completions.create({
        model: parameters.model,
        messages: [
            {
                role: 'system',
                content: parameters.preamble,
            },
            {
                role: 'user',
                content: input,
            }
        ],
        temperature: 0,
        max_tokens: parameters.maxNewTokens,
        top_p: 1.0,
        frequency_penalty: parameters.repetitionPenalty,
        presence_penalty: 0.0,
    });

    return chatCompletion['choices'][0]['message']['content'];
}

export { getResponseFromOpenAI };

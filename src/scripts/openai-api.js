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

async function getResponseFromOpenAI(parameters, messages) {
    const openai = new OpenAi({
        apiKey: parameters.apiKey,
        dangerouslyAllowBrowser: true,
    });

    const chatCompletion = await openai.chat.completions.create({
        model: parameters.model,
        messages: messages,
        max_tokens: parameters.maxNewTokens,
        temperature: parameters.temperature,
        frequency_penalty: parameters.repetitionPenalty,
    });

    return chatCompletion['choices'][0]['message']['content'];
}

export { getResponseFromOpenAI };

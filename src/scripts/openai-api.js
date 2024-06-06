import { loadExternalModule } from './shared.js';

async function getResponseFromOpenAI(parameters, messages) {
    const OpenAIModule = await loadExternalModule('openai', '4.22.1/+esm');
    if (!OpenAIModule) {
        return;
    }
    const OpenAi = OpenAIModule.default;

    const openai = new OpenAi({
        apiKey: parameters.apiKey,
        dangerouslyAllowBrowser: true,
    });

    const input_parameters = {
        model: parameters.model,
        messages: messages,
        max_tokens: parameters.maxNewTokens,
        temperature: parameters.temperature,
        frequency_penalty: parameters.repetitionPenalty,
    };
    try {
        const chatCompletion = await openai.chat.completions.create(input_parameters);
        return chatCompletion['choices'][0]['message']['content'];
    } catch (error) {
        ui.notifications.error(`Unable to get response from OpenAI: ${error}`);
        return;
    }
}

export { getResponseFromOpenAI };

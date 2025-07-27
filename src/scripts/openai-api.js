import { loadExternalModule } from './shared.js';

function roughNumberOfTokensForOpenAi(messages) {
    const charsPerToken = 4;
    let chars = 0;
    for (const message of messages) {
        chars += message.role.length;
        chars += message.content.length;
    }
    return chars / charsPerToken;
}

function getOpenAiApiParameters(generationParameters) {
    const model = generationParameters.model;
    if (!model) {
        return;
    }
    const modelType = getModelType(model);
    if (!modelType) {
        return;
    }

    let baseUrl;
    let apiKey;
    if (modelType === 'openai') {
        baseUrl = 'https://api.openai.com/v1';
        apiKey = generationParameters.openaiApiKey;
    } else if (modelType === 'google') {
        baseUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/';
        apiKey = generationParameters.googleApiKey;
    } else {
        return;
    }

    if (parameters.baseUrl) {
        baseUrl = parameters.baseUrl;
    }

    return {
        baseURL: baseUrl,
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    };
}

async function getResponseFromOpenAI(parameters, messages) {
    const OpenAIModule = await loadExternalModule('openai');
    if (!OpenAIModule) {
        return;
    }
    const OpenAi = OpenAIModule.default;

    const apiParameters = getOpenAiApiParameters(parameters);
    if (!apiParameters) {
        return;
    }
    const openai = new OpenAi(apiParameters);

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
        const errorMessage = game.i18n.format('unkenny.llm.openAiError', { error: error });
        ui.notifications.error(errorMessage);
        return;
    }
}

export { getResponseFromOpenAI, roughNumberOfTokensForOpenAi };

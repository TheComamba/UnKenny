import { loadExternalModule } from './shared.js';
import { getModelType } from './models.js';

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
    if (modelType === 'openai') {
        baseUrl = 'https://api.openai.com/v1';
    } else if (modelType === 'google') {
        baseUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/';
    } else if (modelType === 'custom') {
        if (generationParameters.customModelName) {
            generationParameters.model = generationParameters.customModelName;
            apiKey = "This is a custom model, no API key needed.";
        } else {
            const errorMessage = game.i18n.localize('unkenny.llm.noModel');
            ui.notifications.error(errorMessage);
            return;
        }
    } else {
        return;
    }

    if (generationParameters.baseUrl) {
        baseUrl = generationParameters.baseUrl;
    }

    if (generationParameters.customModelName) {
        generationParameters.model = generationParameters.customModelName;
    }

    return {
        baseURL: baseUrl,
        apiKey: generationParameters.apiKey,
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

    let input_parameters = {
        model: parameters.model,
        messages: messages,
        max_tokens: parameters.maxNewTokens,
        temperature: parameters.temperature,
    };
    const modelType = getModelType(parameters.model);
    if (modelType != 'google') {
        // Google does not fully support the OpenAI API specification.
        input_parameters = {
            ...input_parameters,
            frequency_penalty: parameters.repetitionPenalty
        };
    }
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

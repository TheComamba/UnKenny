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

async function getResponseFromOpenAI(parameters, messages) {
    // Get all parameters from game settings if not in parameters
    const apiKey = parameters.apiKey || game.settings.get("unkenny", "apiKey");
    const model = parameters.model || game.settings.get("unkenny", "model");
    const maxNewTokens = parameters.maxNewTokens || game.settings.get("unkenny", "maxNewTokens");
    const temperature = parameters.temperature ?? game.settings.get("unkenny", "temperature");
    const repetitionPenalty = parameters.repetitionPenalty ?? game.settings.get("unkenny", "repetitionPenalty");
    
    // Validate required parameters
    if (!apiKey) {
        ui.notifications.error(game.i18n.localize("unkenny.chatMessage.noApiKey"));
        return;
    }

    if (!model) {
        ui.notifications.error(game.i18n.localize("unkenny.chatMessage.noModel"));
        return;
    }

    const OpenAIModule = await loadExternalModule('openai');
    if (!OpenAIModule) {
        return;
    }
    const OpenAi = OpenAIModule.default;

    const openai = new OpenAi({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });

    const input_parameters = {
        model: model,
        messages: messages,
        max_tokens: maxNewTokens,
        temperature: temperature,
        frequency_penalty: repetitionPenalty,
    };
    
    try {
        console.log("OpenAI input parameters:", { ...input_parameters, apiKey: "[REDACTED]" });
        const chatCompletion = await openai.chat.completions.create(input_parameters);
        return chatCompletion['choices'][0]['message']['content'];
    } catch (error) {
        const errorMessage = game.i18n.format('unkenny.llm.openAiError', { error: error });
        ui.notifications.error(errorMessage);
        console.error("OpenAI API error:", error);
        return;
    }
}

export { getResponseFromOpenAI, roughNumberOfTokensForOpenAi };

import { testIfSlow } from './jest-utils.js';
import { getMessages } from './llm.js';

describe('getResponseFromLocalLLM', () => {
    testIfSlow('returns the expected response', async () => {
        const { getResponseFromLocalLLM } = await import('./local-llm.js');

        const parameters = {
            model: 'Xenova/Qwen1.5-1.8B-Chat',
            actorName: 'Histrios',
            preamble: 'Your name is Histrios.',
            minNewTokens: 8,
            maxNewTokens: 128,
            repetitionPenalty: 1.0,
            temperature: 0.0,
        };
        const prompt = 'What is your name?';
        const messages = getMessages(parameters, prompt);

        const response = await getResponseFromLocalLLM(parameters, messages);

        expect(response).toBe('expectedResponse');
    });
});

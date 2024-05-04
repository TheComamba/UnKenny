import { testIfSlow } from './jest-utils.js';

describe('getResponseFromLocalLLM', () => {
    testIfSlow('returns the expected response', async () => {
        const { getResponseFromLocalLLM } = await import('./local-llm.js');

        const parameters = {
            model: 'Xenova/TinyLlama-1.1B-Chat-v1.0',
            actorName: 'Test Actor',
            minNewTokens: 10,
            maxNewTokens: 20,
            repetitionPenalty: 1.0,
            temperature: 1.0,
        };
        const messages = ['Hello', 'World'];

        const response = await getResponseFromLocalLLM(parameters, messages);

        expect(response).toBe('expectedResponse');
    });
});

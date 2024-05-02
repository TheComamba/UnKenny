import { testIfSlow } from './jest-utils.js';
import { getResponseFromLocalLLM } from './local-llm.js';

describe('getResponseFromLocalLLM', () => {
    testIfSlow('returns the expected response', async () => {
        const parameters = {
            model: 'todo',
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

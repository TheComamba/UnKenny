import { expect } from 'chai';
import { testIfSlow } from './test-utils.js';
import { getMessages } from '../src/scripts/llm.js';
import { getResponseFromLocalLLM } from '../src/scripts/local-llm.js';

describe('getResponseFromLocalLLM', () => {
    beforeEach(() => {
        game.reset();
    });

    testIfSlow('returns a somewhat expected response', async () => {
        const parameters = {
            model: 'Xenova/Qwen1.5-1.8B-Chat',
            actorName: 'Bob',
            preamble: 'Your name is Bob.',
            minNewTokens: 8,
            maxNewTokens: 128,
            repetitionPenalty: 1.0,
            temperature: 0.0,
        };
        const prompt = 'Repeat after me: "I am Bob."';
        const messages = getMessages(parameters, prompt);

        const response = await getResponseFromLocalLLM(parameters, messages);
        console.log('Received response:', response);

        expect(global.ui.notifications.error.called).to.be.false;
        expect(response).to.include('Bob');
    });
});

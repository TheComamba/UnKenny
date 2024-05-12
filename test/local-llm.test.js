import { expect } from 'chai';
import { testIfSlow } from './test-utils.js';
import { getMessages } from '../src/scripts/llm.js';
import { getResponseFromLocalLLM } from '../src/scripts/local-llm.js';

describe('getResponseFromLocalLLM', () => {
    beforeEach(() => {
        game.reset();
    });

    testIfSlow('returns the expected response', async () => {

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

        expect(global.ui.notifications.error.called).to.be.false;
        expect(response).to.equal('expectedResponse');
    });
});

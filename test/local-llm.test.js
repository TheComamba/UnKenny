import { expect } from 'chai';
import { testIfSlow } from './test-utils.js';
import { getMessages } from '../src/scripts/llm.js';
import { getResponseFromLocalLLM } from '../src/scripts/local-llm.js';
import { getLocalModels } from '../src/scripts/models.js';

describe('getResponseFromLocalLLM', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    const localModels = getLocalModels();

    localModels.forEach(model => {
        testIfSlow(model + ' returns a somewhat expected response', async () => {
            const parameters = {
                model: model,
                actorName: 'Bob',
                preamble: 'Your name is Bob.',
                minNewTokens: 8,
                maxNewTokens: 128,
                repetitionPenalty: 0.0,
                temperature: 0.0,
            };
            const prompt = 'Repeat after me: "I am Bob."';
            const messages = getMessages(parameters, prompt);

            const response = await getResponseFromLocalLLM(parameters, messages);
            console.log(model, 'generated the following response:\n', response);

            expect(ui.notifications.error.called).to.be.false;
            expect(response).to.include('Bob');
            expect(response).to.not.include('assistant');
        });
    });
});

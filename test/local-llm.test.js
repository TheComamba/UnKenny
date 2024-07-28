import { expect } from 'chai';
import { expectNoNotifications, testIfSlow } from './test-utils.js';
import { messagesOrganisedForTemplate } from '../src/scripts/collecting-chat-messages.js';
import { getResponseFromLocalLLM, numberOfTokensForLocalLLM } from '../src/scripts/local-llm.js';
import { getLocalModels } from '../src/scripts/models.js';
import mockReset from '../__mocks__/main.js';

describe('numberOfTokensForLocalLLM', function () {
    this.timeout(10000);
    const localModels = getLocalModels();

    this.beforeEach(() => {
        mockReset();
    });

    localModels.forEach(model => {
        it(model + ' tokenizer returns a somewhat expected number', async () => {
            const text = 'Your name is Bob. You are the architect of your own destiny. And scissors. For some reason you construct scissors.';
            const actor = new Actor('Bob');
            await actor.setFlag('unkenny', 'preamble', text);
            const prompt = text;
            const messages = await messagesOrganisedForTemplate(actor, [], prompt);

            const minExpectedNumber = text.split(' ').length; // One token per word
            const maxExpectedNumber = text.length; // One token per character
            const number = await numberOfTokensForLocalLLM(model, messages);

            expect(number).to.be.greaterThanOrEqual(minExpectedNumber);
            expect(number).to.be.lessThanOrEqual(maxExpectedNumber);
        });
    });
});

describe('getResponseFromLocalLLM', function () {
    beforeEach(() => {
        mockReset();
    });

    const localModels = getLocalModels();

    localModels.forEach(model => {
        testIfSlow(model + ' returns a somewhat expected response', async () => {
            const actor = new Actor('Bob');
            await actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
            const parameters = {
                model: model,
                actorName: actor.name,
                minNewTokens: 8,
                maxNewTokens: 128,
                repetitionPenalty: 0.0,
                temperature: 0.0,
            };
            const prompt = 'Repeat after me: "I am Bob."';
            const messages = await messagesOrganisedForTemplate(actor, [], prompt);

            const response = await getResponseFromLocalLLM(parameters, messages);
            console.log(model, 'generated the following response:\n', response);

            expect(response).to.include('Bob');
            expect(response).to.not.include('assistant');
            expectNoNotifications();
        });
    });
});

import { expect } from 'chai';
import { testIfOpenAi } from './test-utils.js';
import { messagesOrganisedForTemplate } from '../src/scripts/collecting-chat-messages.js';
import { getResponseFromOpenAI, roughNumberOfTokensForOpenAi } from '../src/scripts/openai-api.js';
import { getOpenAiModels } from '../src/scripts/models.js';
import mockReset from '../__mocks__/main.js';

describe('roughNumberOfTokensForOpenAi', function () {
    beforeEach(() => {
        mockReset();
    });

    it('returns a somewhat expected number', async () => {
        const text = 'Your name is Bob. You are the architect of your own destiny. And scissors. For some reason you construct scissors.';
        const actor = new Actor('Bob');
        await actor.setFlag('unkenny', 'preamble', text);
        const prompt = text;
        const messages = await messagesOrganisedForTemplate(actor, [], prompt);

        const minExpectedNumber = text.split(' ').length; // One token per word
        const maxExpectedNumber = text.length; // One token per character
        const number = roughNumberOfTokensForOpenAi(messages);

        expect(number).to.be.greaterThanOrEqual(minExpectedNumber);
        expect(number).to.be.lessThanOrEqual(maxExpectedNumber);
    });
});

describe('getResponseFromOpenAI', function () {
    beforeEach(() => {
        mockReset();
    });

    const openaiModels = getOpenAiModels();

    openaiModels.forEach(model => {
        testIfOpenAi(model + ' returns a somewhat expected response', async () => {
            const actor = new Actor('Bob');
            await actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
            const parameters = {
                model: model,
                apiKey: process.env.OPENAI_API_KEY,
                actorName: actor.name,
                minNewTokens: 8,
                maxNewTokens: 128,
                repetitionPenalty: 0.0,
                temperature: 0.0,
            };
            const prompt = 'Repeat after me: "I am Bob."';
            const messages = await messagesOrganisedForTemplate(actor, [], prompt);

            const response = await getResponseFromOpenAI(parameters, messages);
            console.log(model, 'generated the following response:\n', response);

            expect(ui.notifications.warn.called).to.be.false;
            expect(ui.notifications.error.called).to.be.false;
            expect(response).to.include('Bob');
            expect(response).to.not.include('assistant');
        });
    });
});

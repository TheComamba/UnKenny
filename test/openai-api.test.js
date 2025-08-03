import { expect } from 'chai';
import { expectNoNotifications, getApiKey, setupLocalModels, testIfModelsEnabled } from './test-utils.js';
import { messagesOrganisedForTemplate } from '../src/scripts/collecting-chat-messages.js';
import { getResponseFromOpenAI } from '../src/scripts/openai-api.js';
import { getAvailableModels } from './test-utils.js';
import mockReset from '../__mocks__/main.js';

describe('getResponseFromOpenAI', function () {
    beforeEach(() => {
        mockReset();
        setupLocalModels();
    });

    const hostedModels = getAvailableModels();

    hostedModels.forEach(model => {
        testIfModelsEnabled(model + ' returns a somewhat expected response', async () => {
            const actor = new Actor('Bob');
            await actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
            const parameters = {
                model: model,
                apiKey: getApiKey(model),
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

            expect(response).to.include('Bob');
            expect(response).to.not.include('assistant');
            expectNoNotifications();
        });
    });
});

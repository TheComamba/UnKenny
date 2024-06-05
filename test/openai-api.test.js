import { expect } from 'chai';
import { testIfOpenAi } from './test-utils.js';
import { messagesOrganisedForTemplate } from '../src/scripts/collecting-chat-messages.js';
import { getResponseFromOpenAI } from '../src/scripts/openai-api.js';
import { getOpenAiModels } from '../src/scripts/models.js';

describe('getResponseFromLocalLLM', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    const openaiModels = getOpenAiModels();

    openaiModels.forEach(model => {
        testIfOpenAi(model + ' returns a somewhat expected response', async () => {
            const actor = new Actor('Bob');
            actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
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
            const messages = messagesOrganisedForTemplate(actor, [], prompt);

            const response = await getResponseFromOpenAI(parameters, messages);
            console.log(model, 'generated the following response:\n', response);

            expect(ui.notifications.error.called).to.be.false;
            expect(response).to.include('Bob');
            expect(response).to.not.include('assistant');
        });
    });
});

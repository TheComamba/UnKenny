import { expect } from 'chai';
import { testIfSlow } from './test-utils.js';
import { messagesOrganisedForTemplate } from '../src/scripts/collecting-chat-messages.js';
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
            const actor = new Actor('Bob');
            actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
            const parameters = {
                model: model,
                actorName: actor.name,
                minNewTokens: 8,
                maxNewTokens: 128,
                repetitionPenalty: 0.0,
                temperature: 0.0,
            };
            const prompt = 'Repeat after me: "I am Bob."';
            const messages = messagesOrganisedForTemplate(actor, [], prompt);

            const response = await getResponseFromLocalLLM(parameters, messages);
            console.log(model, 'generated the following response:\n', response);

            expect(ui.notifications.error.called).to.be.false;
            expect(response).to.include('Bob');
            expect(response).to.not.include('assistant');
        });
    });
});

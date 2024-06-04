import { expect } from 'chai';
import game from '../__mocks__/game.js';
import { getGenerationParameters } from '../src/scripts/llm.js';
import { llmParametersAndDefaults } from '../src/scripts/settings.js';

describe('getGenerationParameters', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return the default values if no flags are set', async () => {
        let actor = new Actor();
        actor.name = 'actor1';
        actor.setFlag('unkenny', 'preamble', 'preamble');
        game.settings.set('unkenny', 'model', 'model1');

        const result = await getGenerationParameters(actor);

        const params = llmParametersAndDefaults();
        expect(result).to.deep.equal({
            actorName: 'actor1',
            model: 'model1',
            apiKey: params.apiKey,
            preamble: 'preamble',
            minNewTokens: params.minNewTokens,
            maxNewTokens: params.maxNewTokens,
            temperature: params.temperature,
            repetitionPenalty: params.repetitionPenalty,
            prefixWithTalk: params.prefixWithTalk
        });
    });

    it('should return the global values if no flags are set', async () => {
        let actor = new Actor();
        actor.name = 'actor1';

        game.settings.set('unkenny', 'model', 'model1');
        game.settings.set('unkenny', 'apiKey', 'apiKey1');
        game.settings.set('unkenny', 'minNewTokens', 10);
        game.settings.set('unkenny', 'maxNewTokens', 20);
        game.settings.set('unkenny', 'temperature', 1.5);
        game.settings.set('unkenny', 'repetitionPenalty', 0.5);
        game.settings.set('unkenny', 'prefixWithTalk', true);

        actor.setFlag('unkenny', 'preamble', 'preamble');

        const result = await getGenerationParameters(actor);

        expect(result).to.deep.equal({
            actorName: 'actor1',
            model: 'model1',
            apiKey: 'apiKey1',
            preamble: 'preamble',
            minNewTokens: 10,
            maxNewTokens: 20,
            temperature: 1.5,
            repetitionPenalty: 0.5,
            prefixWithTalk: true
        });
    });

    it('should return the actor flags if set', async () => {
        let actor = new Actor();
        actor.name = 'actor1';

        game.settings.set('unkenny', 'model', 'model1');
        game.settings.set('unkenny', 'apiKey', 'apiKey1');
        game.settings.set('unkenny', 'minNewTokens', 10);
        game.settings.set('unkenny', 'maxNewTokens', 20);
        game.settings.set('unkenny', 'temperature', 1.5);
        game.settings.set('unkenny', 'repetitionPenalty', 0.5);
        game.settings.set('unkenny', 'prefixWithTalk', true);

        actor.setFlag('unkenny', 'preamble', 'preamble');
        actor.setFlag('unkenny', 'model', 'model2');
        actor.setFlag('unkenny', 'minNewTokens', 11);
        actor.setFlag('unkenny', 'maxNewTokens', 21);
        actor.setFlag('unkenny', 'temperature', 1.6);
        actor.setFlag('unkenny', 'repetitionPenalty', 0.6);
        actor.setFlag('unkenny', 'prefixWithTalk', false);

        const result = await getGenerationParameters(actor);

        expect(result).to.deep.equal({
            actorName: 'actor1',
            model: 'model2',
            apiKey: 'apiKey1',
            preamble: 'preamble',
            minNewTokens: 11,
            maxNewTokens: 21,
            temperature: 1.6,
            repetitionPenalty: 0.6,
            prefixWithTalk: false
        });
    });

    it('should print a warning if no preamble is set', async () => {
        let actor = new Actor();
        actor.name = 'actor1';

        game.settings.set('unkenny', 'model', 'model1');
        game.settings.set('unkenny', 'apiKey', 'apiKey1');
        game.settings.set('unkenny', 'minNewTokens', 10);
        game.settings.set('unkenny', 'maxNewTokens', 20);
        game.settings.set('unkenny', 'temperature', 1.5);
        game.settings.set('unkenny', 'repetitionPenalty', 0.5);
        game.settings.set('unkenny', 'prefixWithTalk', true);

        const result = await getGenerationParameters(actor);

        expect(ui.notifications.warning.called).to.be.true;
    });

    it('should print an error and return null if no model is set', async () => {
        let actor = new Actor();
        actor.name = 'actor1';

        game.settings.set('unkenny', 'apiKey', 'apiKey1');
        game.settings.set('unkenny', 'minNewTokens', 10);
        game.settings.set('unkenny', 'maxNewTokens', 20);
        game.settings.set('unkenny', 'temperature', 1.5);
        game.settings.set('unkenny', 'repetitionPenalty', 0.5);
        game.settings.set('unkenny', 'prefixWithTalk', true);

        const result = await getGenerationParameters(actor);

        expect(ui.notifications.error.called).to.be.true;
        expect(result).to.be.null;
    });
});

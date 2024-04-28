import game from '../../__mocks__/game.js';
import { getGenerationParameters, llmParametersAndDefaults } from './llm.js';

describe('getGenerationParameters', () => {
    it('should return the default values if no flags are set', async () => {
        let actor = new Actor();
        actor.name = 'actor1';

        const result = await getGenerationParameters(actor);

        const params = llmParametersAndDefaults();
        expect(result).toEqual({
            actorName: 'actor1',
            model: params.model,
            apiKey: params.apiKey,
            preamble: params.preamble,
            minNewTokens: params.minNewTokens,
            maxNewTokens: params.maxNewTokens,
            repetitionPenalty: params.repetitionPenalty,
            llmType: params.llmType,
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
        game.settings.set('unkenny', 'repetitionPenalty', 0.5);
        game.settings.set('unkenny', 'llmType', 'type1');
        game.settings.set('unkenny', 'prefixWithTalk', true);

        const result = await getGenerationParameters(actor);

        expect(result).toEqual({
            actorName: 'actor1',
            model: 'model1',
            apiKey: 'apiKey1',
            preamble: '',
            minNewTokens: 10,
            maxNewTokens: 20,
            repetitionPenalty: 0.5,
            llmType: 'type1',
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
        game.settings.set('unkenny', 'repetitionPenalty', 0.5);
        game.settings.set('unkenny', 'llmType', 'type1');
        game.settings.set('unkenny', 'prefixWithTalk', true);

        actor.setFlag('unkenny', 'model', 'model2');
        actor.setFlag('unkenny', 'preamble', 'preamble2');
        actor.setFlag('unkenny', 'minNewTokens', 11);
        actor.setFlag('unkenny', 'maxNewTokens', 21);
        actor.setFlag('unkenny', 'repetitionPenalty', 0.6);
        actor.setFlag('unkenny', 'llmType', 'type2');
        actor.setFlag('unkenny', 'prefixWithTalk', false);

        const result = await getGenerationParameters(actor);

        expect(result).toEqual({
            actorName: 'actor1',
            model: 'model2',
            apiKey: 'apiKey1',
            preamble: 'preamble2',
            minNewTokens: 11,
            maxNewTokens: 21,
            repetitionPenalty: 0.6,
            llmType: 'type2',
            prefixWithTalk: false
        });
    });
});

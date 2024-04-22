import { getGenerationParameters } from './llm.js';

describe('getGenerationParameters', () => {
    beforeEach(() => {
        global.ui = { notifications: { error: jest.fn() } };
    });

    it('should return correct parameters', async () => {
        let actor = new Actor();
        actor.name = 'actor1';
        actor.setFlag('unkenny', 'model', 'model1');
        actor.setFlag('unkenny', 'llmAPIKey', 'apiKey1');
        actor.setFlag('unkenny', 'preamble', 'preamble1');
        actor.setFlag('unkenny', 'minNewTokens', 10);
        actor.setFlag('unkenny', 'maxNewTokens', 20);
        actor.setFlag('unkenny', 'repetitionPenalty', 0.5);
        actor.setFlag('unkenny', 'llmType', 'type1');
        actor.setFlag('unkenny', 'prefixWithTalk', true);

        const result = await getGenerationParameters(actor);

        expect(result).toEqual({
            actorName: 'actor1',
            model: 'model1',
            apiKey: 'apiKey1',
            preamble: 'preamble1',
            minNewTokens: 10,
            maxNewTokens: 20,
            repetitionPenalty: 0.5,
            llmType: 'type1',
            prefixWithTalk: true
        });
    });

    it('should return null and log error if a parameter is missing', async () => {
        for (let key of ['model', 'preamble', 'minNewTokens', 'maxNewTokens', 'repetitionPenalty', 'llmType']) {
            let actor = new Actor();
            actor.name = 'actor1';
            actor.setFlag('unkenny', 'model', 'model1');
            actor.setFlag('unkenny', 'preamble', 'preamble1');
            actor.setFlag('unkenny', 'minNewTokens', 10);
            actor.setFlag('unkenny', 'maxNewTokens', 20);
            actor.setFlag('unkenny', 'repetitionPenalty', 0.5);
            actor.setFlag('unkenny', 'llmType', 'type1');
            actor.setFlag('unkenny', 'prefixWithTalk', true);

            actor.setFlag('unkenny', key, null);

            const result = await getGenerationParameters(actor);

            expect(result).toBeNull();
            expect(global.ui.notifications.error).toHaveBeenCalled();
        }
    });
});

// TODO: Test that actor flags overwrite global flags

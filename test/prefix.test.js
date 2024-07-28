import { expect } from 'chai';
import { setupHooks } from '../src/scripts/main.js';
import mockReset from '../__mocks__/main.js';
import { prefixResponse } from '../src/scripts/prefix.js';
import { getGenerationParameters } from '../src/scripts/llm.js';

describe('prefixResponse', function () {
    let actor = new Actor();

    beforeEach(async () => {
        mockReset();
        setupHooks
        Hooks.call('init');
        await actor.setFlag('unkenny', 'preamble', 'preamble');
        game.settings.set('unkenny', 'model', 'model1');
    });

    it('does nothing if no game setting is modified', async () => {
        let response = "Hello";
        let parameters = await getGenerationParameters(actor);
        let prefixedResponse = await prefixResponse(response, parameters);
        expect(prefixedResponse).to.equal("Hello");
    });

    it('prefixes response with /talk if the corresponding game setting is set', async () => {
        game.settings.set("unkenny", "prefixWithTalk", true);
        let response = "Hello";
        let parameters = await getGenerationParameters(actor);
        let prefixedResponse = await prefixResponse(response, parameters);
        expect(prefixedResponse).to.equal("/talk Hello");
    });
});

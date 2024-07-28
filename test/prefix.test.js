import { expect } from 'chai';
import { setupHooks } from '../src/scripts/main.js';
import mockReset from '../__mocks__/main.js';
import { prefixResponse } from '../src/scripts/prefix.js';
import { getGenerationParameters } from '../src/scripts/llm.js';

describe('prefixResponse', function () {
    beforeEach(() => {
        mockReset();
        setupHooks
        Hooks.call('init');
    });

    it('does nothing if no game setting is modified', async () => {
        let actor = new Actor();
        let response = "Hello";
        let parameters = getGenerationParameters(actor);
        let prefixedResponse = await prefixResponse(response, parameters);
        expect(prefixedResponse).to.equal("Hello");
    });

    it('prefixes response with /talk if the corresponding game setting is set', async () => {
        game.settings.set("unkenny", "prefixWithTalk", true);
        let actor = new Actor();
        let response = "Hello";
        let parameters = getGenerationParameters(actor);
        let prefixedResponse = await prefixResponse(response, parameters);
        expect(prefixedResponse).to.equal("/talk Hello");
    });
});

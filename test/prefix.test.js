import { expect } from 'chai';
import { setupHooks } from '../src/scripts/main.js';
import mockReset from '../__mocks__/main.js';
import { PREFIX_OPTIONS, prefixResponse } from '../src/scripts/prefix.js';
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
        for (let [key, prefix] of Object.entries(PREFIX_OPTIONS)) {
            game.settings.set("unkenny", "prefix", key);
            let response = "Hello";
            let parameters = await getGenerationParameters(actor);
            let prefixedResponse = await prefixResponse(response, parameters);
            expect(prefixedResponse).to.equal(prefix + "Hello");
        }
    });

    it('prefixes response with /talk if the actor flag is set', async () => {
        for (let [key, prefix] of Object.entries(PREFIX_OPTIONS)) {
            await actor.setFlag('unkenny', 'prefix', key);
            let response = "Hello";
            let parameters = await getGenerationParameters(actor);
            let prefixedResponse = await prefixResponse(response, parameters);
            expect(prefixedResponse).to.equal(prefix + "Hello");
        }
    });

    it('prints a warning message if the prefix is invalid', async () => {
        game.settings.set("unkenny", "prefix", "invalidPrefixOfDeathAndDestruction");
        let response = "Hello";
        let parameters = await getGenerationParameters(actor);
        await prefixResponse(response, parameters);
        expect(ui.notifications.warning.called).to.be.true;
    });
});

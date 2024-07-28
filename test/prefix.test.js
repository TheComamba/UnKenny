import { expect } from 'chai';
import { setupHooks } from '../src/scripts/main.js';
import mockReset from '../__mocks__/main.js';
import { PREFIX_OPTIONS, prefixResponse, replacePlaceholders } from '../src/scripts/prefix.js';
import { getGenerationParameters } from '../src/scripts/llm.js';
import { expectNoNotifications } from './test-utils.js';

describe('replacePlaceholder', function () {
    beforeEach(async () => {
        mockReset();
    });

    it('replaces <user> with the username', function () {
        let prefix = "<user>";
        let replacedPrefix = replacePlaceholders(prefix);
        expect(replacedPrefix).to.equal(game.user.name);
    });

    it('does not replace <user> if it is not present', function () {
        let prefix = "/whisper";
        let replacedPrefix = replacePlaceholders(prefix);
        expect(replacedPrefix).to.equal(prefix);
    });
});

describe('prefixResponse', function () {
    let actor = new Actor();

    beforeEach(async () => {
        mockReset();
        setupHooks();
        Hooks.call('init');
        await actor.setFlag('unkenny', 'preamble', 'preamble');
        game.settings.set('unkenny', 'model', 'model1');
        await actor.unsetFlag('unkenny', 'prefix');
    });

    it('does nothing if no game setting is modified', async () => {
        let response = "Hello";
        let parameters = await getGenerationParameters(actor);
        let prefixedResponse = await prefixResponse(response, parameters);
        expect(prefixedResponse).to.equal("Hello");
        expectNoNotifications();
    });

    it('prefixes response if the corresponding game setting is set', async () => {
        for (let [key, prefix] of Object.entries(PREFIX_OPTIONS)) {
            game.settings.set("unkenny", "prefix", key);
            let response = "Hello";
            let parameters = await getGenerationParameters(actor);
            
            let prefixedResponse = await prefixResponse(response, parameters);
            
            prefix = replacePlaceholders(prefix);
            expect(prefixedResponse).to.equal(prefix + "Hello");
            expectNoNotifications();
        }
    });

    it('prefixes response if the actor flag is set', async () => {
        for (let [key, prefix] of Object.entries(PREFIX_OPTIONS)) {
            await actor.setFlag('unkenny', 'prefix', key);
            let response = "Hello";
            let parameters = await getGenerationParameters(actor);
            
            let prefixedResponse = await prefixResponse(response, parameters);

            prefix = replacePlaceholders(prefix);
            expect(prefixedResponse).to.equal(prefix + "Hello");
            expectNoNotifications();
        }
    });

    it('replaces <user> with the username for whisper', async () => {
        await actor.setFlag('unkenny', 'prefix', 'whisper');
        let response = "Hello";
        let parameters = await getGenerationParameters(actor);
        let prefixedResponse = await prefixResponse(response, parameters);
        expect(prefixedResponse).to.equal("/whisper " + game.user.name + " Hello");
        expectNoNotifications();
    });

    it('prints a warning message if the prefix is invalid', async () => {
        game.settings.set("unkenny", "prefix", "invalidPrefixOfDeathAndDestruction");
        let response = "Hello";
        let parameters = await getGenerationParameters(actor);
        await prefixResponse(response, parameters);
        expect(ui.notifications.warn.called).to.be.true;
    });
});

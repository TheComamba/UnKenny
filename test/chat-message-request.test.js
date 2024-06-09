import { expect } from 'chai';
import sinon from 'sinon';

import { findAdressedAlias } from '../src/scripts/chat-message-request.js';

describe('findAdressedAlias', function () {
    it('should return null if message is null', () => {
        const message = null;
        const result = findAdressedAlias(message);
        expect(result).to.be.null;
    });

    it('should return null if no alias is addressed', () => {
        const message = "Kapascardia";
        const result = findAdressedAlias(message);
        expect(result).to.be.null;
    });

    it('should return the alias if it is addressed at the beginning of the message', () => {
        const message = "@alias Kapascardia";
        const result = findAdressedAlias(message);
        expect(result).to.equal('alias');
    });

    it('should return the alias if it is addressed anywhere in the message', () => {
        const message = "Kapascardia @alias funurkel";
        const result = findAdressedAlias(message);
        expect(result).to.equal('alias');
    });

    it('should return the alias if it is addressed at the end of the message', () => {
        const message = "Kapascardia @alias";
        const result = findAdressedAlias(message);
        expect(result).to.equal('alias');
    });

    it('should return the alias in lowercase', () => {
        const message = "Kapascardia @Alias funurkel";
        const result = findAdressedAlias(message);
        expect(result).to.equal('alias');
    });

    it('should return only the first alias if multiple aliases are addressed', () => {
        const message = "Kapascardia @alias1 @alias2 @alias3";
        const result = findAdressedAlias(message);
        expect(result).to.equal('alias1');
    });
});

import { replaceAlias } from '../src/scripts/chat-message-request.js';

describe('replaceAlias', function () {
    it('should return the original message if message is empty', () => {
        const result = replaceAlias("", "alias", "John");
        expect(result).to.equal("");
    });

    it('should return the original message if alias is empty', () => {
        const message = "Hello @alias, how are you?";
        const result = replaceAlias(message, "", "John");
        expect(result).to.equal(message);
    });

    it('should replace the alias anywhere in the message with actor name', () => {
        const message = "Hello @alias, how are you?";
        const result = replaceAlias(message, "alias", "John");
        expect(result).to.equal("Hello <b>John</b>, how are you?");
    });

    it('should replace the alias in case insensitive manner', () => {
        const message = "Hello @Alias, how are you?";
        const result = replaceAlias(message, "alias", "John");
        expect(result).to.equal("Hello <b>John</b>, how are you?");
    });

    it('should replace all occurrences of the alias in the message', () => {
        const message = "@Malkovich @Malkovich @Malkovich";
        const result = replaceAlias(message, "Malkovich", "John");
        expect(result).to.equal("<b>John</b> <b>John</b> <b>John</b>");
    });
});

import { actorHasAlias } from '../src/scripts/chat-message-request.js';

describe('actorHasAlias', function () {
    let actor;
    let consoleSpy;

    beforeEach(() => {
        actor = new Actor();
        consoleSpy = sinon.stub(console, 'error');
    });

    afterEach(() => {
        consoleSpy.restore();
    });

    it('should return false when alias is empty string', async () => {
        expect(await actorHasAlias(actor, '')).to.equal(false);
    });

    it('should return false when actor has no alias set', async () => {
        expect(await actorHasAlias(actor, 'John Doe')).to.equal(false);
    });

    it('should return true when actor has alias set', async () => {
        await actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(await actorHasAlias(actor, 'John Doe')).to.equal(true);
    });

    it('should return true when actor has alias set, regardless of case', async () => {
        await actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(await actorHasAlias(actor, 'john doe')).to.equal(true);
        expect(await actorHasAlias(actor, 'JOHN DOE')).to.equal(true);
    });

    it('should return false when actor has different alias set', async () => {
        await actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(await actorHasAlias(actor, 'Jane Doe')).to.equal(false);
    });

    it('should return false when actor has alias set but queried with empty string', async () => {
        await actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(await actorHasAlias(actor, '')).to.equal(false);
    });

    it('should log an error when actor is null', async () => {
        await actorHasAlias(null, 'John Doe');
        expect(consoleSpy.called).to.be.true;
    });

    it('should log an error when alias is not a string', async () => {
        await actorHasAlias(actor, 123);
        expect(consoleSpy.called).to.be.true;
    });
});

import { findAdressedActor } from '../src/scripts/chat-message-request.js';

describe('findAdressedActor', function () {
    beforeEach(() => {
        game.reset()
        ui.reset();
    });

    it('should return null when no alias is addressed', async () => {
        const actor = new Actor();
        await actor.setFlag('unkenny', 'alias', 'alias');
        game.addActor(actor);

        const message = "Kapascardia";
        const result = await findAdressedActor(message);
        expect(result).to.be.null;
    });

    it('should return null and display an error when actor with alias is not found', async () => {
        const actor = new Actor();
        await actor.setFlag('unkenny', 'alias', 'other-alias');
        game.addActor(actor);

        const message = "Kapascardia @alias";
        const result = await findAdressedActor(message);
        expect(result).to.be.null;
        expect(ui.notifications.error.called).to.be.true;
    });

    it('should return the actor when alias is addressed', async () => {
        const actor = new Actor();
        await actor.setFlag('unkenny', 'alias', 'alias');
        game.addActor(actor);

        const message = "@alias Kapascardia";
        const result = await findAdressedActor(message);
        expect(result).to.equal(actor);
    });
});

import { modifyUnkennyChatData } from '../src/scripts/chat-message-request.js';
import { findFirstMessageConcerning, waitForMessagesToBePosted } from './test-utils.js';
import { overwriteChatMessage } from '../src/scripts/chat-message-response.js';

describe('modifyUnkennyChatData', function () {
    it('should replace the alias with the actor name', async () => {
        const chatData = {
            content: "Hello, @jd!",
        };
        let addressedActor = new Actor("John Doe");
        await addressedActor.setFlag("unkenny", "alias", "jd");
        await modifyUnkennyChatData(chatData, addressedActor);
        expect(chatData.content).to.equal("Hello, <b>John Doe</b>!");
    });
});

describe('posting a message with an alias', function () {
    beforeEach(() => {
        game.reset()
        ui.reset();
        overwriteChatMessage();
    });

    it('should replace that alias with the actor name', async () => {
        let actor = new Actor("John Doe");
        await actor.setFlag("unkenny", "alias", "jd");
        game.addActor(actor);

        let messageContent = "Hello, @jd!";
        let expectedContent = "Hello, <b>John Doe</b>!";
        await ui.chat.processMessage(messageContent);
        await waitForMessagesToBePosted(1);
        const message = game.messages.find(m => m.data.content === expectedContent);
        expect(message).to.not.be.undefined;
    });

    it('should set the conversationWith flag', async () => {
        let actor = new Actor("John Doe");
        await actor.setFlag("unkenny", "alias", "jd");
        game.addActor(actor);

        let messageContent = "Hello, @jd!";
        await ui.chat.processMessage(messageContent);
        await waitForMessagesToBePosted(1);
        const message = findFirstMessageConcerning(actor);
        expect(message).to.not.be.undefined;
    });
});

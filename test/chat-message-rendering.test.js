import { expect } from 'chai';
import mockReset from '../__mocks__/main.js';

import ChatMessage from '../__mocks__/chat-message.js';
import { waitForMessagesToBePosted } from './test-utils.js';
import { setupHooks } from '../src/scripts/main.js';
import Actor from '../__mocks__/actor.js';
import User from '../__mocks__/user.js';

describe('adjustHtml', function () {
    beforeEach(() => {
        mockReset();
        setupHooks();
    });

    const actor = new Actor("Kenny");
    const user = new User("Cornfield");

    it('should prepend nothing if the message is not unkenny', async function () {
        await ChatMessage.create({ content: "Kapascardia" });
        await waitForMessagesToBePosted(1);
        let message = game.messages.contents[0];

        let html = await message.getHTML();

        let messageContent = html.find('.message-content').html();
        expect(messageContent).to.not.contain('Speaking with');
    });

    it('should prepend the adressed actor if the message is posted by the user', async function () {
        await ChatMessage.create({ content: "Kapascardia", speaker: {} });
        await waitForMessagesToBePosted(1);
        let message = game.messages.contents[0];
        message.user = user;
        await message.setFlag('unkenny', 'conversationWith', actor.id);

        let html = await message.getHTML();

        let messageContent = html.find('.message-content').html();
        expect(messageContent).to.contain('Speaking with Kenny');
    });

    it('should prepend the adressed user if the message is posted by the actor', async function () {
        await ChatMessage.create({ content: "Kapascardia", speaker: { actor: actor.id, alias: 'Kenny' } });
        await waitForMessagesToBePosted(1);
        let message = game.messages.contents[0];
        message.user = user;
        await message.setFlag('unkenny', 'conversationWith', actor.id);

        let html = await message.getHTML();

        let messageContent = html.find('.message-content').html();
        expect(messageContent).to.contain('Speaking with ' + user.name);
    });
});
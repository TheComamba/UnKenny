import { expect } from 'chai';
import mockReset from '../__mocks__/main.js';

import ChatMessage from '../__mocks__/chat-message.js';
import { waitForMessagesToBePosted } from './test-utils.js';
import { setupHooks } from '../src/scripts/main.js';
import Actor from '../__mocks__/actor.js';
import User from '../__mocks__/user.js';
import { generateRandomId } from '../__mocks__/utils.js';
import { CONVERSATION_FLAG } from '../src/scripts/collecting-chat-messages.js';

describe('adjustHtml', function () {
    const actor = new Actor("Kenny");
    const user = new User("Cornfield");

    beforeEach(() => {
        mockReset();
        setupHooks();
        game.addActor(actor);
    });

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
        await message.setFlag('unkenny', CONVERSATION_FLAG, actor.id);

        let html = await message.getHTML();

        let messageContent = html.find('.message-content').html();
        expect(messageContent).to.contain('Speaking with ' + actor.name);
    });

    it('should prepend the adressed user if the message is posted by the actor', async function () {
        await ChatMessage.create({ content: "Kapascardia", speaker: { actor: actor.id, alias: 'Kenny' } });
        await waitForMessagesToBePosted(1);
        let message = game.messages.contents[0];
        message.user = user;
        await message.setFlag('unkenny', CONVERSATION_FLAG, actor.id);

        let html = await message.getHTML();

        let messageContent = html.find('.message-content').html();
        expect(messageContent).to.contain('Speaking with ' + user.name);
    });

    it('should show an error if the actor has been deleted', async function () {
        await ChatMessage.create({ content: "Kapascardia" });
        await waitForMessagesToBePosted(1);
        let message = game.messages.contents[0];
        message.user = user;
        await message.setFlag('unkenny', CONVERSATION_FLAG, generateRandomId());

        let html = await message.getHTML();

        expect(ui.notifications.error.called).to.be.true;
        let messageContent = html.find('.message-content').html();
        expect(messageContent).to.not.contain('Speaking with');
    });
});
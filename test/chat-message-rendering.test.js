import { expect } from 'chai';
import mockReset from '../__mocks__/main.js';

import ChatMessage from '../__mocks__/chat-message.js';
import { waitForMessagesToBePosted } from './test-utils.js';
import { setupHooks } from '../src/scripts/main.js';

describe('adjustHtml', function () {
    beforeEach(() => {
        mockReset();
        setupHooks();
    });

    it('should prepend nothing if the message is not unkenny', async function () {
        await ChatMessage.create({ content: "Kapascardia" });
        await waitForMessagesToBePosted(1);
        let message = game.messages.contents[0];
        let html = await message.getHTML();
        expect(html.content).to.equal(`
        <p style="opacity: 0.5; font-size: 10px;">
            Speaking with Kenny
        </p>
        `);
    });

    it('should prepend the adressed actor if the message is posted by the user', function () {
    });

    it('should prepend the adressed user if the message is posted by the actor', function () {
    });
});
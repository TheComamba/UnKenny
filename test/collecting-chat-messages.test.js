import { expect } from "chai";
import { collectPreviousMessages, sortMessages, messagesOrganisedForTemplate, collectChatMessages } from "../src/scripts/collecting-chat-messages.js";

describe('collectPreviousMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return an empty list if there are no previous messages', () => {
        const actor = new Actor();
        let messages = collectPreviousMessages(actor);
        expect(messages.length).to.equal(0);
    });

    it('should return an empty list if there are only messages for another actor', () => {
        const actor1 = new Actor();
        const actor2 = new Actor();
        const message = new ChatMessage();
        message.setFlag('unkenny', 'actorId', actor2.id);
        game.messages.set(message.id, message);

        let messages = collectPreviousMessages(actor1);

        expect(messages.length).to.equal(0);
    });

    it('should return only messages adressed at the specified actor', () => {
        const actor1 = new Actor();
        const message1 = new ChatMessage();
        message1.setFlag('unkenny', 'actorId', actor1.id);
        game.messages.set(message1.id, message1);
        
        const actor2 = new Actor();
        const message2 = new ChatMessage();
        message2.setFlag('unkenny', 'actorId', actor2.id);
        game.messages.set(message2.id, message2);
        
        let messages = collectPreviousMessages(actor1);
        
        expect(messages.length).to.equal(1);
        expect(messages[0].id).to.equal(message1.id);
    });
});

describe('sortMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should sort messages by timestamp', () => {
        expect(true).to.equal(false);
    });
});

describe('messagesOrganisedForTemplate', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return preamble and newMessageContent if previousMessages is empty', () => {
        expect(true).to.equal(false);
    });

    it('should assign the "user" role to previous messages posted by the user', () => {
        expect(true).to.equal(false);
    });

    it('should assign the "assistant" role to previous messages posted by the actor', () => {
        expect(true).to.equal(false);
    });

    it('should display an error if the actor has no preamble', () => {
        expect(true).to.equal(false);
    });
});

describe('collectChatMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return a chat template list including previously posted messages', () => {
        expect(true).to.equal(false);
    });
});
import { expect } from "chai";
import sinon from 'sinon';
import { collectPreviousMessages, sortMessages, messagesOrganisedForTemplate, collectChatMessages } from "../src/scripts/collecting-chat-messages.js";

describe('collectPreviousMessages', () => {
    const actor1 = new Actor();
    const actor2 = new Actor();

    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return an empty list if there are no previous messages', () => {
        let messages = collectPreviousMessages(actor1);
        expect(messages.length).to.equal(0);
    });

    it('should return an empty list if there are only messages for another actor', () => {
        const message = new ChatMessage();
        message.setFlag('unkenny', 'conversationWith', actor2.id);
        game.messages.set(message.id, message);

        let messages = collectPreviousMessages(actor1);

        expect(messages.length).to.equal(0);
    });

    it('should return only messages adressed at the specified actor', () => {
        const message1 = new ChatMessage();
        message1.setFlag('unkenny', 'conversationWith', actor1.id);
        game.messages.set(message1.id, message1);

        const message2 = new ChatMessage();
        message2.setFlag('unkenny', 'conversationWith', actor2.id);
        game.messages.set(message2.id, message2);

        let messages = collectPreviousMessages(actor1);

        expect(messages.length).to.equal(1);
        expect(messages[0].id).to.equal(message1.id);
    });


    it('should return all messages adressed at the specified actor', () => {
        const message1 = new ChatMessage();
        message1.setFlag('unkenny', 'conversationWith', actor1.id);
        game.messages.set(message1.id, message1);
        const message2 = new ChatMessage();
        message2.setFlag('unkenny', 'conversationWith', actor1.id);
        game.messages.set(message2.id, message2);

        let messages = collectPreviousMessages(actor1);

        expect(messages.length).to.equal(2);
        expect(messages[0].id).to.equal(message1.id);
        expect(messages[1].id).to.equal(message2.id);
    });
});

describe('sortMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should sort messages by timestamp', () => {
        const message1 = new ChatMessage();
        message1._initialize();
        const message2 = new ChatMessage();
        message2._initialize();
        const message3 = new ChatMessage();
        message3._initialize();
        let messages = [
            message3,
            message1,
            message2
        ];

        sortMessages(messages);

        expect(messages[0].id).to.equal(message1.id);
        expect(messages[1].id).to.equal(message2.id);
        expect(messages[2].id).to.equal(message3.id);
    });
});

describe('messagesOrganisedForTemplate', () => {
    let actor = new Actor();
    const preamble = 'This is a preamble.';
    actor.setFlag('unkenny', 'preamble', preamble);
    const newContent = 'This is a new message.';

    const messageDataPostedByUser = {
        content: 'This is a message posted by the user.'
    };
    const messagePostedByUser = new ChatMessage(messageDataPostedByUser);
    messagePostedByUser._initialize();

    const messageDataPostedByActor = {
        content: 'This is a message posted by the actor.',
        speaker: {
            actor: actor.id
        }
    };
    const messagePostedByActor = new ChatMessage(messageDataPostedByActor);
    messagePostedByActor._initialize();

    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return preamble and newMessageContent if previousMessages is empty', () => {
        let previousMessages = [];
        let messages = messagesOrganisedForTemplate(actor, previousMessages, newContent);

        expect(messages.length).to.equal(2);
        expect(messages[0].role).to.equal('system');
        expect(messages[0].content).to.equal(preamble);
        expect(messages[1].role).to.equal('user');
        expect(messages[1].content).to.equal(newContent);
    });

    it('should assign the "user" role to previous messages posted by the user', () => {
        let previousMessages = [messagePostedByUser];
        let messages = messagesOrganisedForTemplate(actor, previousMessages, newContent);

        expect(messages.length).to.equal(3);
        expect(messages[0].role).to.equal('system');
        expect(messages[0].content).to.equal(preamble);
        expect(messages[1].role).to.equal('user');
        expect(messages[1].content).to.equal(messageDataPostedByUser.content);
        expect(messages[2].role).to.equal('user');
        expect(messages[2].content).to.equal(newContent);
    });

    it('should assign the "assistant" role to previous messages posted by the actor', () => {
        let previousMessages = [messagePostedByActor];
        let messages = messagesOrganisedForTemplate(actor, previousMessages, newContent);

        expect(messages.length).to.equal(3);
        expect(messages[0].role).to.equal('system');
        expect(messages[0].content).to.equal(preamble);
        expect(messages[1].role).to.equal('assistant');
        expect(messages[1].content).to.equal(messageDataPostedByActor.content);
        expect(messages[2].role).to.equal('user');
        expect(messages[2].content).to.equal(newContent);
    });

    it('should display an error if the actor has no preamble', () => {
        let actorWithoutPreamble = new Actor();
        let previousMessages = [];

        messagesOrganisedForTemplate(actorWithoutPreamble, previousMessages, newContent);

        expect(ui.notifications.error.called).to.be.true;
    });
});

describe('collectChatMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return a chat template list including previously posted messages', () => {
        const actor = new Actor();
        const preamble = 'This is a preamble.';
        actor.setFlag('unkenny', 'preamble', preamble);
        const newContent = 'This is a new message.';
        const messageDataPostedByUser = {
            content: 'This is a message posted by the user.'
        };
        const messagePostedByUser = new ChatMessage(messageDataPostedByUser);
        messagePostedByUser._initialize();
        messagePostedByUser.setFlag('unkenny', 'conversationWith', actor.id);

        const messageDataPostedByActor = {
            content: 'This is a message posted by the user.',
            speaker: {
                actor: actor.id
            }
        };
        const messagePostedByActor = new ChatMessage(messageDataPostedByActor);
        messagePostedByActor._initialize();
        messagePostedByActor.setFlag('unkenny', 'conversationWith', actor.id);

        game.messages.set(messagePostedByUser.id, messagePostedByUser);
        game.messages.set(messagePostedByActor.id, messagePostedByActor);

        let messages = collectChatMessages(actor, newContent);

        expect(messages.length).to.equal(4);
        expect(messages[0].role).to.equal('system');
        expect(messages[0].content).to.equal(preamble);
        expect(messages[1].role).to.equal('user');
        expect(messages[1].content).to.equal(messageDataPostedByUser.content);
        expect(messages[2].role).to.equal('assistant');
        expect(messages[2].content).to.equal(messageDataPostedByActor.content);
        expect(messages[3].role).to.equal('user');
        expect(messages[3].content).to.equal(newContent);
    });
});
import { expect } from 'chai';
import { postResponse, processUnKennyResponse, replaceAlias, respond, triggerResponse, unkennyResponseFlag } from '../src/scripts/chat-message-response.js';
import { findFirstMessageConcerning, testIfOpenAi, testIfSlow } from './test-utils.js';
import { getLocalModels, getOpenAiModels } from '../src/scripts/models.js';
import { overwriteChatMessage } from '../src/scripts/collecting-chat-messages.js';
import mockReset from '../__mocks__/main.js';

describe('replaceAlias', function () {
    beforeEach(() => {
        mockReset();
    });

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
        expect(result).to.equal("Hello John, how are you?");
    });

    it('should replace the alias in case insensitive manner', () => {
        const message = "Hello @Alias, how are you?";
        const result = replaceAlias(message, "alias", "John");
        expect(result).to.equal("Hello John, how are you?");
    });

    it('should replace all occurrences of the alias in the message', () => {
        const message = "@Malkovich @Malkovich @Malkovich";
        const result = replaceAlias(message, "Malkovich", "John");
        expect(result).to.equal("John John John");
    });
});

describe('triggerResponse', function () {
    beforeEach(() => {
        mockReset();
        overwriteChatMessage();
    });

    testIfOpenAi('should generate a response from an OpenAI model and trigger a chat message', async () => {
        game.settings.set("unkenny", "apiKey", process.env.OPENAI_API_KEY);
        const openaiModels = getOpenAiModels();
        const model = openaiModels[0];
        await runTriggerResponse(model);
    });

    testIfSlow('should generate a response from a local model and trigger a chat message', async () => {
        game.settings.set("unkenny", "apiKey", "");
        const localModels = getLocalModels();
        const model = localModels[0];
        await runTriggerResponse(model);
    });

    it('should generate an error message if no response is generated', async () => {
        const actor = null;
        const request = "What is your name, @jd?";
        await triggerResponse(actor, request);
        expect(ui.notifications.error.called).to.be.true;
    });
});

async function runTriggerResponse(model) {
    const actor = new Actor("John Doe");
    game.settings.set("unkenny", "model", model);
    await actor.setFlag("unkenny", "alias", "jd");
    await actor.setFlag("unkenny", "preamble", "Your name is John Doe.");
    const request = "What is your name, @jd?";
    await triggerResponse(actor, request);
    expectChatMessageResponse(actor);
}


describe('respond', function () {
    beforeEach(() => {
        mockReset();
        overwriteChatMessage();
    });

    it('should prefix the response and post it', async () => {
        const actor = new Actor("John Doe");
        const response = "Hello";
        const parameters = {
            prefixWithTalk: true
        };
        await respond(response, parameters, actor);
        expectChatMessageResponse(actor, "/talk Hello");
    });

    it('should produce a prefixed response for the chatMessage Hook', async () => {
        const actor = new Actor("John Doe");
        const response = "Hello";
        const parameters = {
            prefixWithTalk: true
        };

        let responseInHook = "";
        Hooks.on('chatMessage', (chatlog, messageText, chatData) => {
            responseInHook = messageText;
        });

        await respond(response, parameters, actor);
        if (!responseInHook.startsWith("/talk Hello")) {
            throw new Error(`Expected response to start with "/talk Hello", but got "${responseInHook}"`);
        }
    });
});

describe('postResponse', function () {
    beforeEach(() => {
        mockReset();
        overwriteChatMessage();
    });

    it('should post a chat message with the response', async () => {
        const actor = new Actor("John Doe");
        const response = "Some response.";
        await postResponse(response, actor);
        expectChatMessageResponse(actor, response);
    });

    it('should replace all linebreaks with <br>', async () => {
        const actor = new Actor("John Doe");
        const responseIn = "Some\nresponse.";
        await postResponse(responseIn, actor);
        const responseOut = "Some<br>response.";
        expectChatMessageResponse(actor, responseOut);
    });

    it('should set the conversationWith flag', async () => {
        const actor = new Actor("John Doe");
        const response = "Some response.";
        await postResponse(response, actor);
        const message = findFirstMessageConcerning(actor);
        expect(message).to.not.be.undefined;
    });
});

function expectChatMessageResponse(actor, response) {
    expect(game.messages.size).to.equal(1);
    let message = game.messages.find(() => true);
    if (response == undefined) {
        expect(message.content).to.not.be.empty;
    } else {
        expect(message.content).to.equal(response);
    }
    expect(message.speaker.actor).to.equal(actor.id);
    expect(message.speaker.alias).to.equal(actor.name);
}

describe('processUnKennyResponse', function () {
    beforeEach(() => {
        mockReset();
    });

    it('should process flagged data correctly', () => {
        const data = {
            content: unkennyResponseFlag + '{"content":"Hello","speaker":{"actor":"blmXW5O6DAwXf08v"}}'
        };
        let message = new ChatMessage(data);

        processUnKennyResponse(message);

        expect(message._source.content).to.equal('Hello');
        expect(message._source.speaker.actor).to.equal('blmXW5O6DAwXf08v');
        expect(ui.notifications.error.called).to.be.false;
    });

    it('should handle invalid flagged data', () => {
        const invalidJson = unkennyResponseFlag + '{"content":';
        const data = {
            content: invalidJson
        };
        let message = new ChatMessage(data);

        processUnKennyResponse(message);

        expect(message._source.content).to.equal(invalidJson);
        expect(ui.notifications.error.called).to.be.true;
    });

    if ('should not process unflagged data', () => {
        const unflaggedData = "We support Team Emilia.";
        const data = {
            content: unflaggedData
        };
        let message = new ChatMessage(data);

        processUnKennyResponse(message);

        expect(message._source.content).to.equal(unflaggedData);
        expect(ui.notifications.error.called).to.be.false;
    });
});

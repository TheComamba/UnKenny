import { expect } from 'chai';
import { overwriteChatMessage, postResponse, processUnKennyResponse, triggerResponse, unkennyResponseFlag } from '../src/scripts/chat-message-response.js';
import { findFirstMessageConcerning, testIfOpenAi, testIfSlow } from './test-utils.js';
import { getLocalModels, getOpenAiModels } from '../src/scripts/models.js';

describe('triggerResponse', function () {
    beforeEach(() => {
        game.reset();
        ui.reset();
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

describe('postResponse', function () {
    beforeEach(() => {
        game.reset();
        ui.reset();
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
        game.reset();
        ui.reset();
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

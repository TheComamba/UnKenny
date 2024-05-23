import { expect } from 'chai';
import { modifyUnkennyChatData, processUnKennyResponseData, triggerResponse, unkennyResponseFlag } from '../src/scripts/chat-message.js';
import { testIfOpenAi, testIfSlow } from './test-utils.js';
import { getLocalModels, getOpenAiModels } from '../src/scripts/models.js';

describe('modifyUnkennyChatData', () => {
    it('should replace the alias with the actor name', () => {
        const chatData = {
            content: "Hello, @jd!",
        };
        let addressedActor = new Actor("John Doe");
        addressedActor.setFlag("unkenny", "alias", "jd");
        modifyUnkennyChatData(chatData, addressedActor);
        expect(chatData.content).to.equal("Hello, <b>John Doe</b>!");
    });
});

describe('triggerResponse', () => {
    beforeEach(() => {
        game.reset();
        ChatMessage.reset();
        ui.reset();
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
    actor.setFlag("unkenny", "alias", "jd");
    actor.setFlag("unkenny", "preamble", "Your name is John Doe.");
    const request = "What is your name, @jd?";
    await triggerResponse(actor, request);
    expect(ChatMessage.database.length).to.equal(1);
    expect(ChatMessage.database[0].content).to.not.be.empty;
    expect(ChatMessage.database[0].speaker.actor).to.equal(actor.id);
}


describe('processUnKennyResponseData', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should process flagged data correctly', () => {
        const data = {
            content: unkennyResponseFlag + '{"content":"Hello","type":"whisper","actorName":"John"}'
        };

        processUnKennyResponseData(data);

        expect(data.content).to.equal('Hello');
        expect(data.type).to.equal('whisper');
        expect(data.actorName).to.equal('John');
        expect(ui.notifications.error.called).to.be.false;
    });

    it('should handle invalid flagged data', () => {
        const invalidJson = unkennyResponseFlag + '{"content":';
        const data = {
            content: invalidJson
        };

        processUnKennyResponseData(data);

        expect(data.content).to.equal(invalidJson);
        expect(ui.notifications.error.called).to.be.true;
    });

    if ('should not process unflagged data', () => {
        const unflaggedData = "We support Team Emilia.";
        const data = {
            content: unflaggedData
        };

        processUnKennyResponseData(data);

        expect(data.content).to.equal(unflaggedData);
        expect(ui.notifications.error.called).to.be.false;
    });
});

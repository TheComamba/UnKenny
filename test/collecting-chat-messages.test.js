import { expect } from "chai";
import { collectPreviousMessages, sortMessages, messagesOrganisedForTemplate, collectChatMessages, truncateMessages, classContainsUnkennyChatMessage, overwriteChatMessage } from "../src/scripts/collecting-chat-messages.js";
import { getLocalModels, getOpenAiModels, getTokenLimit, isLocal } from "../src/scripts/models.js";
import { numberOfTokensForLocalLLM } from "../src/scripts/local-llm.js";
import { roughNumberOfTokensForOpenAi } from "../src/scripts/openai-api.js";
import { generateRandomId } from "../__mocks__/utils.js";

describe('collectPreviousMessages', function () {
    const actor1 = new Actor();
    const actor2 = new Actor();

    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return an empty list if there are no previous messages', async () => {
        let messages = await collectPreviousMessages(actor1);
        expect(messages.length).to.equal(0);
    });

    it('should return an empty list if there are only messages for another actor', async () => {
        const message = new ChatMessage();
        message.id = generateRandomId();
        await message.setFlag('unkenny', 'conversationWith', actor2.id);
        game.messages.set(message.id, message);

        let messages = await collectPreviousMessages(actor1);

        expect(messages.length).to.equal(0);
    });

    it('should return only messages adressed at the specified actor', async () => {
        const message1 = new ChatMessage();
        message1.id = generateRandomId();
        await message1.setFlag('unkenny', 'conversationWith', actor1.id);
        game.messages.set(message1.id, message1);

        const message2 = new ChatMessage();
        message2.id = generateRandomId();
        await message2.setFlag('unkenny', 'conversationWith', actor2.id);
        game.messages.set(message2.id, message2);

        let messages = await collectPreviousMessages(actor1);

        expect(messages.length).to.equal(1);
        expect(messages[0].id).to.equal(message1.id);
    });


    it('should return all messages adressed at the specified actor', async () => {
        const message1 = new ChatMessage();
        message1.id = generateRandomId();
        await message1.setFlag('unkenny', 'conversationWith', actor1.id);
        game.messages.set(message1.id, message1);
        const message2 = new ChatMessage();
        message2.id = generateRandomId();
        await message2.setFlag('unkenny', 'conversationWith', actor1.id);
        game.messages.set(message2.id, message2);

        let messages = await collectPreviousMessages(actor1);

        expect(messages.length).to.equal(2);
        expect(messages[0].id).to.equal(message1.id);
        expect(messages[1].id).to.equal(message2.id);
    });
});

describe('sortMessages', function () {
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

describe('messagesOrganisedForTemplate', async function () {
    let actor = new Actor();
    const preamble = 'This is a preamble.';
    await actor.setFlag('unkenny', 'preamble', preamble);
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

    it('should return preamble and newMessageContent if previousMessages is empty', async () => {
        let previousMessages = [];
        let messages = await messagesOrganisedForTemplate(actor, previousMessages, newContent);

        expect(messages.length).to.equal(2);
        expect(messages[0].role).to.equal('system');
        expect(messages[0].content).to.equal(preamble);
        expect(messages[1].role).to.equal('user');
        expect(messages[1].content).to.equal(newContent);
    });

    it('should assign the "user" role to previous messages posted by the user', async () => {
        let previousMessages = [messagePostedByUser];
        let messages = await messagesOrganisedForTemplate(actor, previousMessages, newContent);

        expect(messages.length).to.equal(3);
        expect(messages[0].role).to.equal('system');
        expect(messages[0].content).to.equal(preamble);
        expect(messages[1].role).to.equal('user');
        expect(messages[1].content).to.equal(messageDataPostedByUser.content);
        expect(messages[2].role).to.equal('user');
        expect(messages[2].content).to.equal(newContent);
    });

    it('should assign the "assistant" role to previous messages posted by the actor', async () => {
        let previousMessages = [messagePostedByActor];
        let messages = await messagesOrganisedForTemplate(actor, previousMessages, newContent);

        expect(messages.length).to.equal(3);
        expect(messages[0].role).to.equal('system');
        expect(messages[0].content).to.equal(preamble);
        expect(messages[1].role).to.equal('assistant');
        expect(messages[1].content).to.equal(messageDataPostedByActor.content);
        expect(messages[2].role).to.equal('user');
        expect(messages[2].content).to.equal(newContent);
    });

    it('should display an error if the actor has no preamble', async () => {
        let actorWithoutPreamble = new Actor();
        let previousMessages = [];

        await messagesOrganisedForTemplate(actorWithoutPreamble, previousMessages, newContent);

        expect(ui.notifications.error.called).to.be.true;
    });
});

describe('truncateMessages', function () {
    this.timeout(10000);
    const localModel = getLocalModels()[0];
    const openaiModel = getOpenAiModels()[0];
    const newTokenLimit = 100;

    it('should not truncate message to local model below the token limit', async () => {
        const content = await getContentWorthOneFifthOfTokenLimit(localModel);
        let messages = [
            {
                role: 'system',
                content: content
            },
            {
                role: 'user',
                content: content
            },
            {
                role: 'assistant',
                content: content
            },
            {
                role: 'user',
                content: content
            }
        ];

        await truncateMessages(localModel, messages, newTokenLimit);

        expect(messages.length).to.equal(4);
        expect(ui.notifications.warning.called).to.be.false;
    });

    it('should truncate messages to local models starting with the first message that is not the preamble', async () => {
        const content = await getContentWorthOneFifthOfTokenLimit(localModel);
        let messages = [
            {
                role: 'system',
                content: content
            },
            {
                role: 'user',
                content: content
            },
            {
                role: 'assistant',
                content: content
            },
            {
                role: 'user',
                content: content
            },
            {
                role: 'assistant',
                content: content
            },
            {
                role: 'user',
                content: content
            },
            {
                role: 'assistant',
                content: content
            },
            {
                role: 'user',
                content: content
            }
        ];

        await truncateMessages(localModel, messages, newTokenLimit);

        expect(messages.length).to.be.greaterThanOrEqual(4);
        expect(messages.length).to.be.lessThanOrEqual(6);
        expect(messages[0].role).to.equal('system');
        expect(ui.notifications.warning.called).to.be.true;
    });

    it('should truncate messages to local models if the expected output does not fit inside the context limit', async () => {
        const content = await getContentWorthOneFifthOfTokenLimit(localModel);
        let messages = [
            {
                role: 'system',
                content: content
            },
            {
                role: 'user',
                content: content
            },
            {
                role: 'assistant',
                content: content
            },
            {
                role: 'user',
                content: content
            }
        ];
        const hugeLimitForNewTokens = getTokenLimit(localModel) / 5 * 1.5;

        await truncateMessages(localModel, messages, hugeLimitForNewTokens);

        expect(messages.length).to.equal(3);
    });

    it('should display a warning but not truncate any messages to OpenAI models', async () => {
        const content = await getContentWorthOneFifthOfTokenLimit(openaiModel);
        let messages = [
            {
                role: 'system',
                content: content + content
            },
            {
                role: 'user',
                content: content + content
            },
            {
                role: 'assistant',
                content: content + content
            },
            {
                role: 'user',
                content: content + content
            }
        ];

        await truncateMessages(openaiModel, messages, newTokenLimit);

        expect(messages.length).to.equal(4);
        expect(ui.notifications.warning.called).to.be.true;
    });

    it('should display an error and fail if further truncation of local model is not possible', async () => {
        const content = await getContentWorthOneFifthOfTokenLimit(localModel);
        let messages = [
            {
                role: 'system',
                content: content + content + content
            },
            {
                role: 'user',
                content: content + content + content
            }
        ];

        await truncateMessages(localModel, messages, newTokenLimit);

        expect(messages.length).to.equal(0);
        expect(ui.notifications.error.called).to.be.true;
    });
});

async function getContentWorthOneFifthOfTokenLimit(model) {
    const totalLimit = getTokenLimit(model);
    const partialLimit = Math.floor(totalLimit / 5);
    let message = {
        role: 'system',
        content: ''
    };
    let condition;
    if (isLocal(model)) {
        condition = async (m) => await numberOfTokensForLocalLLM(model, [m]) < partialLimit;
    } else {
        condition = async (m) => roughNumberOfTokensForOpenAi([m]) < partialLimit;
    }
    while (await condition(message)) {
        message.content += 'bla ';
    }
    return message.content;
}

describe('collectChatMessages', function () {
    this.timeout(10000);
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return a chat template list including previously posted messages', async () => {
        const newTokenLimit = 100;
        const actor = new Actor();
        const preamble = 'This is a preamble.';
        await actor.setFlag('unkenny', 'preamble', preamble);
        const newContent = 'This is a new message.';
        const messageDataPostedByUser = {
            content: 'This is a message posted by the user.'
        };
        const messagePostedByUser = new ChatMessage(messageDataPostedByUser);
        messagePostedByUser.id = generateRandomId();
        messagePostedByUser._initialize();
        await messagePostedByUser.setFlag('unkenny', 'conversationWith', actor.id);

        const messageDataPostedByActor = {
            content: 'This is a message posted by the user.',
            speaker: {
                actor: actor.id
            }
        };
        const messagePostedByActor = new ChatMessage(messageDataPostedByActor);
        messagePostedByActor.id = generateRandomId();
        messagePostedByActor._initialize();
        await messagePostedByActor.setFlag('unkenny', 'conversationWith', actor.id);

        game.messages.set(messagePostedByUser.id, messagePostedByUser);
        game.messages.set(messagePostedByActor.id, messagePostedByActor);

        let messages = await collectChatMessages(actor, newContent, newTokenLimit);

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

describe('classContainsUnkennyChatMessage', function () {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return false if the chat message class is not UnkennyChatMessage', () => {
        expect(classContainsUnkennyChatMessage(ChatMessage)).to.be.false;
    });

    it('should return true if the chat message class is UnkennyChatMessage', () => {
        class UnkennyChatMessage extends ChatMessage { }
        expect(classContainsUnkennyChatMessage(UnkennyChatMessage)).to.be.true;
    });

    it('should return true if the chat message class inherits from UnkennyChatMessage', () => {
        class UnkennyChatMessage extends ChatMessage { }
        class AnotherChatMessage extends UnkennyChatMessage { }
        class YetAnotherChatMessage extends AnotherChatMessage { }
        expect(classContainsUnkennyChatMessage(YetAnotherChatMessage)).to.be.true;
    });
});

describe('overwriteChatMessage', function () {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should overwrite the chat message class', () => {
        const currentChatMessage = CONFIG.ChatMessage.documentClass;
        if (currentChatMessage.name === 'UnkennyChatMessage') {
            return;
        }
        overwriteChatMessage();
        const newChatMessage = CONFIG.ChatMessage.documentClass;
        expect(Object.getPrototypeOf(newChatMessage).name).to.equal('UnkennyChatMessage');
        expect(Object.getPrototypeOf(newChatMessage).name).to.equal('ChatMessage');
    });

    it('should not overwrite the chat message class if it is already UnkennyChatMessage', () => {
        class UnkennyChatMessage extends ChatMessage { }
        CONFIG.ChatMessage.documentClass = UnkennyChatMessage;
        overwriteChatMessage();
        const newChatMessage = CONFIG.ChatMessage.documentClass;
        expect(newChatMessage.name).to.equal('UnkennyChatMessage');
        expect(Object.getPrototypeOf(newChatMessage).name).to.equal('ChatMessage');
    });
});

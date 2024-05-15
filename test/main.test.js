import { expect } from 'chai';
import { testIfOpenAi, testIfSlow, waitFor } from './test-utils.js';
import { llmParametersAndDefaults } from '../src/scripts/llm.js';
import { getLocalModels, getOpenAiModels } from '../src/scripts/models.js';
import ChatMessage from '../__mocks__/chat-message.js';
import Hooks from '../__mocks__/hooks.js';

describe('main.js tests', () => {
  beforeEach(() => {
    game.reset();
  });

  it('main.js can be loaded as an ES module entry point', async () => {
    const module = await import('../src/scripts/main.js');
    expect(module).to.exist;
  });

  it('After loading main.js, the game object settings have the defaults', async () => {
    await import('../src/scripts/main.js');
    Hooks.call('init');

    const params = llmParametersAndDefaults();
    for (let key in params) {
      try {
        expect(game.settings.get("unkenny", key)).to.equal(params[key]);
      } catch (error) {
        throw new Error(`Failed at key ${key} with error ${error.message}`);
      }
    }
  });

  it('After loading main.js, the game object settings has no members besides the llm parameters', async () => {
    await import('../src/scripts/main.js');
    Hooks.call('init');

    const params = llmParametersAndDefaults();
    for (let key in game.settings.settings) {
      if (!params.hasOwnProperty(key)) {
        throw new Error(`Unexpected key ${key} found in game.settings.settings`);
      }
    }
  });
});

describe('UnkennyChatMessage', () => {
  let chatMessage;

  beforeEach(() => {
    chatMessage = new UnkennyChatMessage();
  });

  it('should process TeamEmilia data correctly', () => {
    const data = {
      content: '#TeamEmilia{"content":"Hello","type":"whisper","actorName":"John"}'
    };
    const user = {
      name: ''
    };

    chatMessage._preCreate(data, {}, user);

    expect(data.content).to.equal('Hello');
    expect(data.type).to.equal('whisper');
    expect(user.name).to.equal('John');
  });

  it('should handle invalid TeamEmilia data', () => {
    const data = {
      content: '#TeamEmilia{"content":"Hello"}'
    };
    const user = {
      name: ''
    };

    chatMessage._preCreate(data, {}, user);

    expect(data.content).to.equal('#TeamEmilaForeverHello');
    expect(user.name).to.equal('');
  });
});

describe('Integration test', () => {
  beforeEach(() => {
    game.reset();
    ChatMessage.reset();
    ui.reset();
  });

  testIfOpenAi('should be possible to post a message and get a response from an OpenAI model', async () => {
    game.settings.set("unkenny", "apiKey", process.env.OPENAI_API_KEY);
    const openaiModels = getOpenAiModels();
    const model = openaiModels[0];
    await postMessageAndCheckReply(model);
  });

  testIfSlow('should be possible to post a message and get a response from a local model', async () => {
    game.settings.set("unkenny", "apiKey", "");
    const localModels = getLocalModels();
    const model = localModels[0];
    await postMessageAndCheckReply(model);
  });
});

async function postMessageAndCheckReply(model) {
  await import('../src/scripts/main.js');
  Hooks.call('init');

  game.settings.set("unkenny", "model", model);
  game.settings.set("unkenny", "minNewTokens", 1);
  game.settings.set("unkenny", "maxNewTokens", 250);
  game.settings.set("unkenny", "repetitionPenalty", 0.0);
  game.settings.set("unkenny", "temperature", 1.0);
  game.settings.set("unkenny", "prefixWithTalk", false);

  let actor = new Actor('Robert');
  actor.setFlag('unkenny', 'alias', 'bob');
  actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
  game.addActor(actor);

  const message = 'What is your name, @bob?';
  simulateUserInput(message);

  expect(ChatMessage.database.length).to.be.greaterThan(0);
  await waitFor(() => {
    return ChatMessage.database.length === 2 || // Happy path
      ui.notifications.warning.called || // Sad path
      ui.notifications.error.called; // Sad path
  });
  expect(ChatMessage.database[0].content).to.equal('What is your name, <b>Robert</b>?');
  expect(ChatMessage.database[0].user).to.equal(game.user.id);
  expect(ChatMessage.database[1].content).to.not.be.empty;
  expect(ChatMessage.database[1].speaker.actor).to.equal(actor.id);
  expect(ui.notifications.warning.called).to.be.false;
  expect(ui.notifications.error.called).to.be.false;
}

function simulateUserInput(message) {
  const chatLog = null;
  const chatData = {
    user: game.user.id,
    content: message,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  };
  Hooks.call('chatMessage', chatLog, message, chatData);
}


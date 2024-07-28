import { expect } from 'chai';
import { testIfOpenAi, testIfSlow, waitForMessagesToBePosted } from './test-utils.js';
import { getLocalModels, getOpenAiModels } from '../src/scripts/models.js';
import ChatMessage from '../__mocks__/chat-message.js';
import Hooks from '../__mocks__/hooks.js';
import { setupHooks } from '../src/scripts/main.js';
import { llmParametersAndDefaults } from '../src/scripts/settings.js';
import mockReset from '../__mocks__/main.js';

describe('main.js', function () {
  this.beforeEach(() => {
    mockReset();
  });

  it('does not contain import errors and can thus be loaded as an ES module entry point', async () => {
    let module = await import('../src/scripts/main.js');
    expect(module).to.exist;
  });
});

describe('setupHooks', async function () {
  beforeEach(() => {
    mockReset();
  });

  it('After init Hook, the game object settings have the defaults', () => {
    setupHooks();
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

  it('After init Hook, the game object settings has no members besides the llm parameters', () => {
    setupHooks();
    Hooks.call('init');
    const params = llmParametersAndDefaults();
    for (let key in game.settings.settings) {
      if (!params.hasOwnProperty(key)) {
        throw new Error(`Unexpected key ${key} found in game.settings.settings`);
      }
    }
  });

  it('After setup Hook, the ChatMessage class inherits from UnKennyChatMessage which inherits from TestChatMessage', () => {
    class TestChatMessage extends ChatMessage { }
    CONFIG.ChatMessage.documentClass = TestChatMessage;
    setupHooks();
    Hooks.call('setup');
    expect(CONFIG.ChatMessage.documentClass.name).to.equal('UnKennyChatMessage');
    expect(Object.getPrototypeOf(CONFIG.ChatMessage.documentClass)).to.equal(TestChatMessage);
  });
});

describe('Integration test', function () {
  beforeEach(() => {
    mockReset();
    Hooks.call('init');
    Hooks.call('setup');
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

  game.settings.set("unkenny", "model", model);

  let actor = new Actor('Robert');
  await actor.setFlag('unkenny', 'alias', 'bob');
  await actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
  game.addActor(actor);

  const messageContent = 'What is your name, @bob?';
  ui.chat.processMessage(messageContent);

  await waitForMessagesToBePosted(2);
  expect(game.messages.size).to.equal(2);

  let request = game.messages.find(m => m.data.content === messageContent);
  expect(request.content).to.equal(messageContent);
  expect(request.user).to.equal(game.user.id);

  let reply = game.messages.find(m => m.data.content != messageContent);
  expect(reply.content).to.not.be.empty;
  expect(reply.speaker.actor).to.equal(actor.id);

  expect(ui.notifications.warn.called).to.be.false;
  expect(ui.notifications.error.called).to.be.false;
}

import { expect } from 'chai';
import { testIfSlow, waitFor } from './test-utils.js';
import { llmParametersAndDefaults } from '../src/scripts/llm.js';
import { getModels, isLocal } from '../src/scripts/models.js';
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

describe('Integration test', () => {
  beforeEach(() => {
    game.reset();
    ChatMessage.reset();
    ui.reset();
  });

  testIfSlow('should be possible to select a local model, create an unkenny actor, and generate a response that is posted in the chat', async () => {
    await import('../src/scripts/main.js');
    Hooks.call('init');

    const localModels = getModels().filter(model => isLocal(model.path));
    const model = localModels[0];
    game.settings.set("unkenny", "model", model.path);

    let actor = new Actor();
    actor.setFlag('unkenny', 'alias', 'bob');
    actor.setFlag('unkenny', 'preamble', 'Your name is Bob.');
    game.addActor(actor);

    const chatLog = null;
    const message = '/bob What is your name?';
    const chatData = {
      user: game.user.id,
      content: message,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    }
    Hooks.call('chatMessage', chatLog, message, chatData);

    expect(ChatMessage.database.length).to.be.greaterThan(0);
    await waitFor(() => ChatMessage.database.length === 2);
    expect(ChatMessage.database[0].content).to.equal('What is your name?');
    expect(ChatMessage.database[0].user).to.equal(game.user.id);
    expect(ChatMessage.database[1].content).to.not.be.empty;
    expect(ChatMessage.database[1].speaker.actor).to.equal(actor.id);
    expect(ui.notifications.warning.called).to.be.false;
    expect(ui.notifications.warning.error).to.be.false;
  });
});

import { llmParametersAndDefaults } from '../src/scripts/llm.js';

describe('main.js tests', () => {
  beforeEach(() => {
    Hooks.on.mockReset();
  });

  it('main.js can be loaded as an ES module entry point', async () => {
    const module = await import('../src/scripts/main.js');
    expect(module).to.exist;
  });

  it('After loading main.js, the game object settings have the defaults', async () => {
    await import('../src/scripts/main.js');

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

    const params = llmParametersAndDefaults();
    for (let key in game.settings.settings) {
      if (!params.hasOwnProperty(key)) {
        throw new Error(`Unexpected key ${key} found in game.settings.settings`);
      }
    }
  });
});

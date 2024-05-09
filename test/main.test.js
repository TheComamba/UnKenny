import { llmParametersAndDefaults } from '../src/scripts/llm.js';
import * as main from '../src/scripts/main.js';

test('main.js can be loaded as an ES module entry point', () => {
  expect(main).toBeDefined();
});

test('After loading main.js, the game object settings have the defaults', () => {
  const params = llmParametersAndDefaults();
  for (let key in params) {
    try {
      expect(game.settings.get("unkenny", key)).toEqual(params[key]);
    } catch (error) {
      throw new Error(`Failed at key ${key} with error ${error.message}`);
    }
  }
});

test('After loading main.js, the game object settings has no members besides the llm parameters', () => {
  const params = llmParametersAndDefaults();

  for (let key in game.settings.settings) {
    if (!params.hasOwnProperty(key)) {
      throw new Error(`Unexpected key ${key} found in game.settings.settings`);
    }
  }
});

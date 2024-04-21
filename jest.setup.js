global.Actor = require('./__mocks__/actor.js').default;
global.Dialog = require('./__mocks__/dialog.js').default;
global.DocumentSheet = require('./__mocks__/document-sheet.js').default;
global.game = require('./__mocks__/game.js').default;
global.Hooks = require('./__mocks__/hooks.js').default;

beforeEach(() => {
  Hooks.on.mockReset();
});

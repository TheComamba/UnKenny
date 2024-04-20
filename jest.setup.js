global.DocumentSheet = require('./__mocks__/document-sheet.js').default;
global.Dialog = require('./__mocks__/dialog.js').default;
global.Hooks = require('./__mocks__/hooks.js').default;

beforeEach(() => {
  Hooks.on.mockReset();
});

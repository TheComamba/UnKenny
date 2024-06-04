import fs from 'fs';
import dotenv from 'dotenv';

import Actor from './__mocks__/actor.js';
import ChatMessage from './__mocks__/chat-message.js';
import CONST from './__mocks__/CONST.js';
import Dialog from './__mocks__/dialog.js';
import DocumentSheet from './__mocks__/document-sheet.js';
import game from './__mocks__/game.js';
import Hooks from './__mocks__/hooks.js';
import ui from './__mocks__/ui.js';

global.Actor = Actor;
global.ChatMessage = ChatMessage;
global.CONST = CONST;
global.Dialog = Dialog;
global.DocumentSheet = DocumentSheet;
global.game = game;
global.Hooks = Hooks;
global.ui = ui;

if (fs.existsSync('.env')) {
    dotenv.config();
}
let test = process.env.OPENAI_API_KEY;
console.log(test);

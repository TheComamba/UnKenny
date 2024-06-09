import fs from 'fs';
import dotenv from 'dotenv';

import Actor from './__mocks__/actor.js';
import ChatLog from './__mocks__/chat-log.js'
import ChatMessage from './__mocks__/chat-message.js';
import CONFIG from './__mocks__/CONFIG.js';
import CONST from './__mocks__/CONST.js';
import Dialog from './__mocks__/dialog.js';
import DocumentSheet from './__mocks__/document-sheet.js';
import game from './__mocks__/game.js';
import Hooks from './__mocks__/hooks.js';
import ui from './__mocks__/ui.js';
import Collection from './__mocks__/collection.js';

global.Actor = Actor;
global.ChatMessage = ChatMessage;
global.Collection = Collection
global.CONFIG = CONFIG;
global.CONST = CONST;
global.Dialog = Dialog;
global.DocumentSheet = DocumentSheet;
global.game = game;
global.Hooks = Hooks;
global.ui = ui;

global.CONFIG = {
    ChatMessage: {
        documentClass: ChatMessage,
    },
    ui: {
        chat: ChatLog,
    },
};

if (fs.existsSync('.env')) {
    dotenv.config({ override: true });
}

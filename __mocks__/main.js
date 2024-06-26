import Actor from './actor.js';
import ChatLog from './chat-log.js'
import ChatMessage from './chat-message.js';
import CONFIG from './CONFIG.js';
import CONST from './CONST.js';
import Dialog from './dialog.js';
import DocumentSheet from './document-sheet.js';
import game from './game.js';
import Hooks from './hooks.js';
import ui from './ui.js';
import Collection from './collection.js';

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

function mockReset() {
    game.reset()
    Hooks.reset();
    ui.reset();
}

export default mockReset;

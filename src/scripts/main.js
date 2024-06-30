import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { getConversationWithFlagSync, overwriteChatMessage } from "./collecting-chat-messages.js";
import { registerGameParameters } from "./settings.js";
import { adjustHtml } from "./chat-message-rendering.js";

// CONFIG.debug.hooks = true;

const UNKENNY_ICON = "fas fa-microchip";
const REMOVE_FROM_CONVERSATION = '<i class="fas fa-comment-slash"></i>';

function setupHooks() {
  Hooks.once('init', function () {
    registerGameParameters();
  });

  Hooks.once('setup', function () {
    overwriteChatMessage();
  });

  Hooks.on("getActorSheetHeaderButtons", function (sheet, buttons) {
    buttons.unshift({
      label: "Modify UnKennyness",
      class: "modify-unkennyness",
      icon: UNKENNY_ICON,
      onclick: () => {
        new UnKennySheet(sheet.object).render(true);
      }
    })
  });

  Hooks.on("renderChatMessage", function (message, html, data) {
    adjustHtml(message, html);
  });

  Hooks.on('getChatLogEntryContext', (html, options) => {
    options.push({
      name: "Remove from UnKenny Conversation",
      icon: REMOVE_FROM_CONVERSATION,
      condition: listItem => {
        const message = game.messages.get(listItem.data("messageId"));
        const conversationWith = getConversationWithFlagSync(message);
        return conversationWith;
      },
      callback: listItem => {
        const message = game.messages.get(listItem.data("messageId"));
      }
    });
  });
}

setupHooks();

export { setupHooks };

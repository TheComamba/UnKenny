import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { overwriteChatMessage } from "./collecting-chat-messages.js";
import { registerGameParameters } from "./settings.js";
import { adjustHtml } from "./chat-message-rendering.js";

// CONFIG.debug.hooks = true;

const UNKENNY_ICON = "fas fa-microchip";
const DELETE_UNKENNY_ICON = '<span class="fa-stack"><i class="fas fa-microchip fa-stack-1x"></i><i class="fas fa-slash fa-stack-1x"></i></span>';

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
      name: "Custom Option",
      icon: DELETE_UNKENNY_ICON,
      condition: listItem => {
        const message = game.messages.get(listItem.data("messageId"));
        return true;
      },
      callback: listItem => {
        const message = game.messages.get(listItem.data("messageId"));
      }
    });
  });
}

setupHooks();

export { setupHooks };

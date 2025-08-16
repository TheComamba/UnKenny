import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { getConversationWithFlagSync, overwriteChatMessage, removeAllMessagesFromUnKennyConversation, removeMessageFromUnKennyConversation } from "./collecting-chat-messages.js";
import { registerGameParameters } from "./settings.js";
import { adjustHtml } from "./chat-message-rendering.js";
import { confirmationDialog } from "../apps/confirmation-dialogue.js";

CONFIG.debug.hooks = true;

const UNKENNY_ICON = "fas fa-microchip";
const REMOVE_FROM_CONVERSATION = '<i class="fas fa-comment-slash"></i>';

function setupHooks() {
  Hooks.once('init', function () {
    // When Foundry loads ChatMessages from the database, it needs to initialise them with out class.
    // Otherwise, the instanceof check when modifying a message will sporadically fail.
    // This is the reason for this early overwrite.
    overwriteChatMessage();
    registerGameParameters();
  });

  Hooks.once('setup', function () {
    // In case other modules overwrite the ChatMessage class as well, but do not inherit from the current class,
    // we need to overwrite it again after all modules have been set up.
    // This is the reason for this late overwrite.
    overwriteChatMessage();
  });

  Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
    const label = game.i18n.localize("unkenny.sheet.title");
    buttons.unshift({
      label: label,
      class: "modify-UnKenniness",
      icon: UNKENNY_ICON,
      onclick: () => {
        new UnKennySheet(sheet.object).render(true);
      }
    })
  });

  function getActorSheetClass(sheet) {
    let currentClass = sheet.constructor;
    while (currentClass) {
      const className = currentClass.name;
      if (className === 'ActorSheetV2') {
        return currentClass;
      }
      currentClass = Object.getPrototypeOf(currentClass);
    }
  }

  // Special handling for the DnD5e system.
  Hooks.on("getHeaderControlsCharacterActorSheet", (sheet, buttons) => {
    let actorSheetClass = getActorSheetClass(sheet);

    const label = game.i18n.localize("unkenny.sheet.title");
    const actionName = "modifyUnkenniness";
    actorSheetClass.modifyUnkenniness = () => {
      new UnKennySheet(sheet.object).render(true);
    };
    buttons.unshift({
      label: label,
      icon: UNKENNY_ICON,
      action: actionName
    })

    let options = actorSheetClass.DEFAULT_OPTIONS;
    let actions = options.actions;
    actions[actionName] = actorSheetClass.modifyUnkenniness;
  });

  Hooks.on('renderChatLog', (app, html, data) => {
    const label = game.i18n.localize("unkenny.chatLog.clearConversations");
    const buttonHtml = `
    <a aria-label="${label}" role="button" class="clear-unkenniness" data-tooltip="${label}">
      ${REMOVE_FROM_CONVERSATION}
    </a>`;
    const button = $(buttonHtml);

    html.find('.control-buttons').append(button);

    button.on('click', function () {
      confirmationDialog({
        title: label,
        content: game.i18n.localize("unkenny.chatLog.clearConversationsConfirmation"),
        yesCallback: () => {
          removeAllMessagesFromUnKennyConversation(game.messages.contents);
        }
      });
    });
  });

  Hooks.on("renderChatMessage", function (message, html, data) {
    adjustHtml(message, html);
  });

  Hooks.on('getChatLogEntryContext', (html, options) => {
    options.push({
      name: game.i18n.localize("unkenny.chatLog.removeFromConversation"),
      icon: REMOVE_FROM_CONVERSATION,
      condition: listItem => {
        const message = game.messages.get(listItem.data("messageId"));
        const conversationWith = getConversationWithFlagSync(message);
        return conversationWith;
      },
      callback: listItem => {
        const message = game.messages.get(listItem.data("messageId"));
        removeMessageFromUnKennyConversation(message);
      }
    });
  });
}

setupHooks();

export { setupHooks };

import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { getConversationWithFlagSync, overwriteChatMessage, removeAllMessagesFromUnkennyConversation, removeMessageFromUnkennyConversation } from "./collecting-chat-messages.js";
import { registerGameParameters } from "./settings.js";
import { adjustHtml } from "./chat-message-rendering.js";
import { confirmationDialog } from "../apps/confirmation-dialogue.js";

// CONFIG.debug.hooks = true;

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

  Hooks.on('renderChatLog', (app, html, data) => {
    const label = "Clear UnKenny Conversations";
    const buttonHtml = `
    <a aria-label="${label}" role="button" class="clear-unkenniness" data-tooltip="${label}">
      ${REMOVE_FROM_CONVERSATION}
    </a>`;
    const button = $(buttonHtml);

    html.find('.control-buttons').append(button);

    button.on('click', function () {
      confirmationDialog({
        title: "Clear UnKenny Conversations",
        content: "Are you sure you want to clear all UnKenny Conversations? This will not delete any messages.",
        yesCallback: () => {
          removeAllMessagesFromUnkennyConversation(game.messages.contents);
        }
      });
    });
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
        removeMessageFromUnkennyConversation(message);
      }
    });
  });
}

setupHooks();

export { setupHooks };

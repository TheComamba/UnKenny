import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny } from "./shared.js";
import { overwriteChatMessage } from "./collecting-chat-messages.js";
import { registerGameParameters } from "./settings.js";

// CONFIG.debug.hooks = true;

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
      icon: "fas fa-microchip",
      onclick: () => {
        new UnKennySheet(sheet.object).render(true);
      }
    })
  });

  Hooks.on("renderChatMessage", function (message, html, data) {
    let audience = 'TODO';
    let unkennyMarker = `
      <p style="opacity: 0.5; font-size: 10px;">
        Speaking with ${audience}
      </p>
    `;
    html.find('.message-content').prepend(unkennyMarker);
  });
}

setupHooks();

export { setupHooks };

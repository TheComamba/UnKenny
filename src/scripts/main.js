import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny } from "./shared.js";
import { overwriteChatMessage } from "./collecting-chat-messages.js";
import { registerGameParameters } from "./settings.js";

// CONFIG.debug.hooks = true;

function setupHooks() {
  Hooks.once('init', function () {
    overwriteChatMessage();
    registerGameParameters();
  });

  Hooks.on("getActorSheetHeaderButtons", async (sheet, buttons) => {
    let buttonText = await isUnkenny(sheet.object) ? "Modify UnKennyness" : "Make UnKenny";
    buttons.unshift({
      label: buttonText,
      class: "modify-unkennyness",
      icon: "fas fa-microchip",
      onclick: () => {
        new UnKennySheet(sheet.object).render(true);
      }
    })
  });
}

setupHooks();

export { setupHooks };

import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny } from "./shared.js";
import { findAdressedActor, modifyUnkennyChatData } from "./chat-message-request.js";
import { overwriteChatMessage, triggerResponse } from "./chat-message-response.js";
import { registerGameParameters } from "./settings.js";

// CONFIG.debug.hooks = true;

function setupHooks() {
  Hooks.once('init', async function () {
    overwriteChatMessage();
    registerGameParameters();
  });

  Hooks.on("getActorSheetHeaderButtons", async (sheet, buttons) => {
    let buttonText = isUnkenny(sheet.object) ? "Modify UnKennyness" : "Make UnKenny";
    buttons.unshift({
      label: buttonText,
      class: "modify-unkennyness",
      icon: "fas fa-microchip",
      onclick: () => {
        new UnKennySheet(sheet.object).render(true);
      }
    })
  });

  Hooks.on("preCreateChatMessage", (_newMessage, chatData, _options, _originator) => {
    let actor = findAdressedActor(chatData.content);
    if (actor) {
      modifyUnkennyChatData(_newMessage._source, actor);
      triggerResponse(actor, chatData.content);
    }
    return true;
  });
}

setupHooks();

export { setupHooks };

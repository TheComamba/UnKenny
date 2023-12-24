import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny } from "./shared.js";
import { findAdressedActor } from "./macro.js";
import { postResponse } from "./llm.js";

// CONFIG.debug.hooks = true;

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

Hooks.on("chatMessage", (_chatlog, messageText, _chatData) => {
  let actor = findAdressedActor(messageText);
  if (actor) {
    postResponse(actor, messageText);
  }
});

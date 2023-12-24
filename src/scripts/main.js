import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny } from "./shared.js";
import { actorToMacro, executeUnKennyMacro, findAdressedActor } from "./macro.js";
import { postResponse } from "./llm.js";

// CONFIG.debug.hooks = true;

Hooks.on("init", () => {
  game.modules.get("unkenny").api = {
    executeUnKennyMacro
  };
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

Hooks.on("deleteActor", async (actor, _params, _actor_id) => {
  let macro = actorToMacro(actor);
  if (macro) {
    await macro.delete();
  }
});

Hooks.on("chatMessage", (_chatlog, messageText, _chatData) => {
  let actor = findAdressedActor(messageText);
  if (actor) {
    postResponse(actor, messageText);
  }
});

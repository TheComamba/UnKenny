import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny, postInChat } from "./shared.js";
import { findAdressedActor, replaceActorNames } from "./macro.js";
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

Hooks.on("chatMessage", (_chatlog, messageText, chatData) => {
  let actor = findAdressedActor(messageText);
  if (actor) {
    let name = actor.name;
    let alias = actor.getFlag("unkenny", "alias");
    messageText = replaceActorNames(messageText, name, name);
    messageText = replaceActorNames(messageText, alias, name);
    postInChat(chatData.user, messageText);
    postResponse(actor, messageText);
    return false; //Chat message has been posted by UnKenny.
  } else {
    return true; //Chat message needs to be posted by Foudnry.
  }
});

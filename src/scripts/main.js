import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny } from "./unkenny.js";
import { actorToMacro } from "./macro.js";

// CONFIG.debug.hooks = true;

Hooks.on("getActorSheetHeaderButtons", async (sheet, buttons) => {
  let buttonText = isUnkenny(sheet.object) ? "Modify UnKennyness" : "Make UnKenny";
  buttons.unshift({
    label: buttonText,
    class: "modify-unkennyness",
    icon: "fas fa-user",
    onclick: () => {
      new UnKennySheet(sheet.object).render(true);
    }
  })
});

Hooks.on("deleteActor", async (actor, _params, actor_id) => {
  let macro = actorToMacro(actor);
  if (macro) {
    await macro.delete();
  }
});
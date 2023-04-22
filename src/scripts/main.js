import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny } from "./unkenny.js";

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
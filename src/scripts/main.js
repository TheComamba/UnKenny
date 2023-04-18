import UnKennySheet from "../apps/unkenny-sheet.js";

Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
  buttons.unshift({
    label: "Modify UnKennyness",
    class: "modify-unkennyness",
    icon: "fas fa-user",
    onclick: () => {
      new UnKennySheet(sheet.object).render(true);
    }
  })
});
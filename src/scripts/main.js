import UnKennySheet from "../apps/unkenny-sheet.js";

Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
  console.log("\n\n\nhere");
  buttons.unshift({
    label: "Modify UnKennyness",
    class: "modify-unkennyness",
    icon: "fas fa-user",
    onclick: () => {
      new UnKennySheet().render(true);
    }
  })
});
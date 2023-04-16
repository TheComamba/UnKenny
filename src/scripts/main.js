import UnKennyNPCModel from "../data/npc.js";
import UnKennyNPCSheet from "../apps/unkenny-npc-sheet.js";

Hooks.on("init", () => {
    Object.assign(CONFIG.Actor.dataModels, {
        "unkenny-npc.unkenny-npc": UnKennyNPCModel
    });
    DocumentSheetConfig.registerSheet(Actor, "unkenny-npc", UnKennyNPCSheet, {
        types: ["unkenny-npc.unkenny-npc"],
        makeDefault: true
    });
});

import UnKennyNPCModel from "../data/npc.js";
import UnKennyNPCSheet from "../apps/unkenny-npc-sheet.js";

Hooks.on("init", () => {
    Object.assign(CONFIG.Actor.dataModels, {
        "unkenny-llm-npc.UnKennyNPC": UnKennyNPCModel
    });
    DocumentSheetConfig.registerSheet(Actor, "unkenny-llm-npc", UnKennyNPCSheet, {
        types: ["unkenny-llm-npc.UnKennyNPC"],
        makeDefault: true
    });
});

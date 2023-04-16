import UnKennyNPCModel from "../data/npc.js";
import UnKennyNPCSheet from "../apps/unkenny-npc-sheet.js";

Hooks.on("init", () => {
    Object.assign(CONFIG.JournalEntryPage.dataModels, {
        "unkenny-llm-npc.unkenny-npc": UnKennyNPCModel
    });
    DocumentSheetConfig.registerSheet(JournalEntryPage, "unkenny-llm-npc", UnKennyNPCSheet, {
        types: ["unkenny-llm-npc.unkenny-npc"],
        makeDefault: true
    });
});

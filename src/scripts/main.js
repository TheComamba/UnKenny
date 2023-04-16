import UnKennyNPCModel from "../data/npc.js";

Hooks.on("init", () => {
    Object.assign(CONFIG.Actor.dataModels, {
        "unkenny-llm-npc.UnKennyNPC": UnKennyNPCModel
    });
});

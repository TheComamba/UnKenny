import EditNPCApp from "../apps/edit-npc.js";
import GLOBALS from "./shared.js";
import UnKennyNPC from "../data/npc.js";

Hooks.on("renderSidebarTab", async (app, html) => {
    if (app.tabName == GLOBALS.ID) {
        console.log("\n\nUnKenny Render render render\n\n");

        let button = $("<button class='unkenny-npc-button'>UnKenny NPC</button>");

        button.click(function () {
            let exampleNPC = UnKennyNPC.create({ name: "gabi", preamble: "ken" });
            new EditNPCApp(exampleNPC).render(true);
        });

        html.find(".directory-footer").append(button);
    }
})

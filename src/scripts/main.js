import EditNPCApp from "../apps/edit-npc.js";
import UnKennyNPC from "../data/npc.js";

Hooks.on("renderSidebarTab", async (app, html) => {
    if (app.options.id == "actors") {
        let button = $("<button class='unkenny-npc-button'>UnKenny NPC</button>")

        let exampleNPC = new UnKennyNPC;
        exampleNPC.name = "gabi";
        exampleNPC.preamble = "ken";

        button.click(function () {
            new EditNPCApp(exampleNPC).render(true);
        });

        html.find(".directory-footer").append(button);
    }
})

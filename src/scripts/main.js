import EditNPCApp from "../apps/edit-npc.js";

Hooks.on("renderSidebarTab", async (app, html) => {
    if (app.options.id == "actors") {
        let button = $("<button class='unkenny-npc-button'>UnKenny NPC</button>")

        button.click(function () {
            new EditNPCApp().render(true);
        });

        html.find(".directory-footer").append(button);
    }
})

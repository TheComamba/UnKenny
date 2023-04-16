import EditNPCApp from "../apps/edit-npc.js";
import GLOBALS from "./shared.js";
import UnKennyNPC from "../data/npc.js";
import UnKennySidebarDirectory from "./sidebar-directory.js";

function widenSidebar(html) {
    ui.unkenny.render(true);

    html[0]
        .querySelector("#sidebar-tabs")
        .style.setProperty(
            "--sidebar-tab-width",
            `${Math.floor(
                parseInt(getComputedStyle(html[0]).getPropertyValue("--sidebar-width")) /
                (document.querySelector("#sidebar-tabs").childElementCount + 1)
            )}px`
        );
}

function createUnKennyNpcTab(html) {
    const tab = document.createElement("a");
    tab.classList.add("item");
    tab.dataset.tab = GLOBALS.ID;
    tab.dataset.tooltip = GLOBALS.NAME;
    if (!("tooltip" in game)) tab.title = GLOBALS.NAME;

    const icon = document.createElement("i");
    icon.setAttribute("class", CONFIG.Macro.sidebarIcon);
    tab.append(icon);

    if (!document.querySelector(`#sidebar-tabs > [data-tab='${GLOBALS.ID}']`)) {
        document.querySelector("#sidebar-tabs > [data-tab='actors']").after(tab);
    }
}

Hooks.on("init", () => {
    CONFIG.ui.unkenny = UnKennySidebarDirectory;

    game.settings.register(GLOBALS.ID, "clickExecute", {
        name: `${GLOBALS.ID}.settings.clickExecute.name`,
        hint: `${GLOBALS.ID}.settings.clickExecute.hint`,
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => {
            ui.unkenny.render();
        },
    });
});

Hooks.on("renderSidebar", (_app, html) => {
    widenSidebar(html);
    createUnKennyNpcTab(html);
});

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

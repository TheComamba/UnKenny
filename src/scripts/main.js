import EditNPCApp from "../apps/edit-npc.js";
import UnKennyNPC from "../data/npc.js";
import UnKennySidebarDirectory from "./sidebar-directory.js";

function widenSidebar(html) {
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
    tab.dataset.tab = "unkenny";
    tab.dataset.tooltip = "UnKenny NPCs";
    if (!("tooltip" in game)) tab.title = "UnKenny NPCs";

    const icon = document.createElement("i");
    icon.setAttribute("class", CONFIG.Macro.sidebarIcon);
    tab.append(icon);

    if (!document.querySelector("#sidebar-tabs > [data-tab='unkenny']")) {
        document.querySelector("#sidebar-tabs > [data-tab='actors']").after(tab);
    }
}

Hooks.on("init", () => (CONFIG.ui.unkenny = UnKennySidebarDirectory));

Hooks.on("renderSidebar", (_app, html) => {
    widenSidebar(html);
    createUnKennyNpcTab(html);
});

Hooks.on("renderSidebarTab", async (app, html) => {
    // if (app.options.id == "unkenny") {
    if (document.tabName == "unkenny") {
        let button = $("<button class='unkenny-npc-button'>UnKenny NPC</button>")

        button.click(function () {
            let exampleNPC = UnKennyNPC.create({ name: "gabi", preamble: "ken" });
            new EditNPCApp(exampleNPC).render(true);
        });

        html.find(".directory-footer").append(button);
    }
})

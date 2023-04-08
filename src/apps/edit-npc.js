export class EditNPCApp extends Application {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "edit-npc",
            title: "Edit UnKenny NPC",
            template: `edit-npc.hbs`,
            width: 720,
            height: 720,
        });
    }
}
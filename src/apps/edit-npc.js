export default class EditNPCApp extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "edit-npc",
            title: "Edit UnKenny NPC",
            template: `modules/unkenny-llm-npc/apps/edit-npc.hbs`,
            width: 720,
        });
    }
}
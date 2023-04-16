import GLOBALS from "./shared.js";

export default class UnKennySidebarDirectory extends SidebarDirectory {
	constructor(options = {}) {
		super(options);
		if (ui.sidebar) ui.sidebar.tabs.unkenny = this;
		// game.macros.apps.push(this);
	}

	/** @override */
	static documentName = "Macro";

	/** @override */
	static get entity() {
		return "Macro";
	}
	/** @override */
	static get collection() {
		return game.macros;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);
		if (game.settings.get(GLOBALS.ID, "clickExecute"))
			html[0].querySelectorAll(".directory-list .thumbnail, .directory-list .profile").forEach(el => {
				el.classList.add("sidebar-macros-execute");
				el.addEventListener("click", this._onClickThumbnail.bind(this));
			});
	}

	/** @override */
	_getEntryContextOptions() {
		let options = super._getEntryContextOptions();
		return [
			{
				name: "Execute",
				icon: `<i class="fas fa-terminal"></i>`,
				condition: data => {
					const macro = game.macros.get(data[0].dataset.entityId || data[0].dataset.documentId);
					return (
						macro.data.type === "script" &&
						(macro.permission === (CONST.ENTITY_PERMISSIONS?.OWNER ?? CONST.DOCUMENT_PERMISSION_LEVELS.OWNER) ||
							macro.testUserPermission(
								game.user,
								CONST.ENTITY_PERMISSIONS?.OWNER ?? CONST.DOCUMENT_PERMISSION_LEVELS.OWNER
							))
					);
				},
				callback: data => {
					const macro = game.macros.get(data[0].dataset.entityId || data[0].dataset.documentId);
					macro.execute();
				},
			},
		].concat(options);
	}

	/**
	 * Handle clicking on a Document thumbnail in the Macro Sidebar directory
	 * @param {Event} event   The originating click event
	 * @protected
	 */
	_onClickThumbnail(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const documentId = element.parentElement.dataset.documentId ?? element.parentElement.dataset.entityId;
		const document = this.constructor.collection.get(documentId);
		document.execute();
	}
}
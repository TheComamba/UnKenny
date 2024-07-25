class UnKennyInfo extends Dialog {
    constructor(text) {
        let params = {
            title: game.i18n.localize("unkenny.info.title"),
            content: `<p>${text}</p><p>${game.i18n.localize("unkenny.info.message")}</p>`,
            buttons: {}
        };
        super(params);
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        return context;
    }
}

export { UnKennyInfo };
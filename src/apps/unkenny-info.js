class UnKennyInfo extends Dialog {
    constructor(text) {
        let params = {
            title: 'Please be patient',
            content: `<p>${text}</p><p>This may take a while, during which FoundryVTT will be unresponsive.</p>`,
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
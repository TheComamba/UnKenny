
class StartServerDialog extends Dialog {
    constructor() {
        let params = {
            title: "Start Unkenny Server",
            content: '<p>Clicking "Start Server" will start the Unkenny server, which will listen for requests from the Unkenny module.</p>',
            buttons: {
                start_button: {
                    label: "Start Server",
                    callback: () => this.start_server(),
                    icon: `<i class="fas fa-play"></i>`
                }
            }
        };
        super(params);
    }

    start_server() {
        console.log("Starting server...");
    }
}

export { StartServerDialog };
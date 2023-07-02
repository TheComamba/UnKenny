
class ServerNotRunningDialog extends Dialog {
    constructor() {
        let params = {
            title: "UnKenny Server not running",
            content: "<p>The UnKenny server is not running. It is not possible to start it from within FoundryVTT. Please run:</p><pre>python3 -m unkenny.server</pre>",
            buttons: {
                ok: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "OK"
                }
            },
        };
        super(params);
    }

    start_server() {
        console.log("Starting server...");
    }
}

export { ServerNotRunningDialog };
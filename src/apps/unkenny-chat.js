import { respondInChat } from "../scripts/chat.js";

class UnKennyChat extends Dialog {
    constructor(actor) {
        let params = {
            title: `Speak with ${actor.name}`,
            content: '<textarea id="message" name="message" rows="20"></textarea>',
            buttons: {
                speak_button: {
                    label: "Speak!",
                    callback: (html) => this.submit(html),
                    icon: `<i class="fas fa-check"></i>`
                }
            }
        };
        super(params);
        this.actor = actor;
    }

    async getData(options = {}) {
        const context = await super.getData(options);
        context.name = this.actor.name;
        return context;
    }

    submit(html) {
        const message = $(html).find("textarea#message");
        respondInChat(this.actor, message)
    }
}

export { UnKennyChat };
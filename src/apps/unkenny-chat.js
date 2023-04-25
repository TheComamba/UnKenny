import { postInChat } from "../scripts/shared.js";
import { respondToInput } from "../scripts/llm.js";

class UnKennyChat extends Dialog {
    constructor(actor) {
        let params = {
            title: `Speak with ${actor.name}`,
            content: '<textarea id="message" name="message" rows="20"></textarea>',
            buttons: {
                speak_button: {
                    label: "Speak!",
                    callback: (html) => this.unkenny_dialog(html),
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

    unkenny_dialog(html) {
        const request = html.find("textarea#message").val();
        postInChat(game.user, request);
        const response = respondToInput(request);
        postInChat(this.actor, response);
    }
}

export { UnKennyChat };
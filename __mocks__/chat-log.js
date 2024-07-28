export default class ChatLog {
    async processMessage(message) {
        const chatMessageClass = ChatMessage.implementation;
        const chatData = {
            user: game.user.id,
            speaker: chatMessageClass.getSpeaker(),
            content: message
        };
        Hooks.call('chatMessage', this, message, chatData);
        return chatMessageClass.create(chatData); // no await here
    }
}

export default class ChatLog {
    async processMessage(message, chatData = {}) {
        const chatMessageClass = ChatMessage.implementation;
        chatData.user = game.user.id;
        chatData.speaker = chatData.speaker || chatMessageClass.getSpeaker();
        chatData.content = message;
        Hooks.call('chatMessage', this, message, chatData);
        return chatMessageClass.create(chatData); // no await here
    }
}

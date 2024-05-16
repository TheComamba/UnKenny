class ChatLog {

    async processMessage(message) {
        const chatMessageClass = ChatMessage.implementation;
        Hooks.call('chatMessage', message);
        const chatData = {
            user: game.user.id,
            speaker: chatMessageClass.getSpeaker()
        };
        return chatMessageClass.create(message, chatData);
    }
}

export default ChatLog;

class ChatLog {

    async processMessage(message) {
        const chatMessageClass = ChatMessage.implementation;
        Hooks.call('chatMessage', message);
        const chatData = {
            user: game.user.id,
            speaker: chatMessageClass.getSpeaker(),
            content: message
        };
        return chatMessageClass.create(chatData);
    }
}

export default ChatLog;

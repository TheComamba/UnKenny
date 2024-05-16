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

//TODO: create ChatLog implementation that implements _processMessage. Creates a ChatMessage of the correct type and stores it in a database.
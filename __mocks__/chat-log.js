class ChatLog {
    static database = [];
    
    _processMessage(message) {
        const chatamessageClass = CONFIG;//TODO I don't quite remember that line, can be found in Foundry Code
        Hooks.call('chatMessage', message);
        const chatData = {
            //todo: what goes in here again?
        }
        const chatMessage = chatMessageClass.create(message, chatData);
        database.push(chatMessage);
    }
    
    reset() {
        this.database = [];
    }
}

//TODO: create ChatLog implementation that implements _processMessage. Creates a ChatMessage of the correct type and stores it in a database.
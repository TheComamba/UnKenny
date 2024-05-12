class ChatMessage {
  static database = [];

  create() {
    const newMessage = new ChatMessage();
    ChatMessage.database.push(newMessage);
    return newMessage;
  }
}

export default ChatMessage;

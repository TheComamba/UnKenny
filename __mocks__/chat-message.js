class ChatMessage {
  static database = [];

  static create(_chatData) {
    const newMessage = new ChatMessage();
    ChatMessage.database.push(newMessage);
    return newMessage;
  }
}

export default ChatMessage;

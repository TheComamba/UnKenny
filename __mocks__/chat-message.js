import Hooks from './hooks.js';

class ChatMessage {
  constructor(chatData) {
    this.content = chatData.content;
    this.speaker = chatData.speaker;
    this.user = chatData.user;
  }

  static database = [];

  static create(chatData) {
    const newMessage = new ChatMessage(chatData);
    ChatMessage.database.push(newMessage);
    return newMessage;
  }

  static reset() {
    ChatMessage.database = [];
  }
}

Hooks.on("chatMessage", (_chatlog, _messageText, chatData) => {
  ChatMessage.create(chatData);
});

export default ChatMessage;

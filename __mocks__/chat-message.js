import Hooks from './hooks.js';

class ChatMessage {
  static database = [];

  static create(_chatData) {
    const newMessage = new ChatMessage();
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

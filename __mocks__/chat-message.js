import Hooks from './hooks.js';

class ChatMessage {
  static database = [];

  static create(_chatData) {
    const newMessage = new ChatMessage();
    ChatMessage.database.push(newMessage);
    return newMessage;
  }
}

Hooks.on("chatMessage", (_chatlog, _messageText, chatData) => {
  ChatMessage.create(chatData);
});

export default ChatMessage;

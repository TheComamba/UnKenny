import Hooks from './hooks.js';

class ChatMessage {
  constructor(chatData) {
    this.applyChatData(chatData);
  }

  static database = [];

  applyChatData(chatData) {
    this.content = chatData.content;
    this.speaker = chatData.speaker;
    this.user = chatData.user;
  }

  static create(chatData) {
    const options = { "temporary": false, "renderSheet": false, "render": true }
    const originator = game.user.id;
    let newMessage = new ChatMessage(chatData);
    Hooks.call("preCreateChatMessage", newMessage, chatData, options, originator);
    newMessage.applyChatData(chatData);
    Hooks.call("createChatMessage", newMessage, options, originator);
    ChatMessage.database.push(newMessage);
  }

  static reset() {
    ChatMessage.database = [];
  }
}

Hooks.on("chatMessage", (_chatlog, _messageText, chatData) => {
  ChatMessage.create(chatData);
});

export default ChatMessage;

import Hooks from './hooks.js';

class ChatMessage {
  static database = [];

  constructor(content, chatData) {
    chatData.content = content;
    this.applyChatData(chatData);
  }

  applyChatData(chatData) {
    this.content = chatData.content;
    this.speaker = chatData.speaker;
    this.user = chatData.user;
  }

  static create(content, chatData) {
    const options = { "temporary": false, "renderSheet": false, "render": true }
    const originator = game.user.id;
    let newMessage = new ChatMessage(content, chatData);
    Hooks.call("preCreateChatMessage", newMessage, chatData, options, originator);
    newMessage.applyChatData(chatData);
    Hooks.call("createChatMessage", newMessage, options, originator);
    this.database.push(newMessage);
  }

  static get implementation() {
    return CONFIG[this.documentName]?.documentClass || this;
  }

  reset() {
    this.database = [];
  }
}

export default ChatMessage;

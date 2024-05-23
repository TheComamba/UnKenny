import Hooks from './hooks.js';

class ChatMessage {
  static database = [];

  constructor(content, chatData) {
    chatData.content = content;
    this.applyChatData(chatData);
  }

  applyChatData(chatData) {
    for (let key in chatData) {
      this[key] = chatData[key] ?? data[key];
    }
  }

  static create(content, chatData) {
    const options = { "temporary": false, "renderSheet": false, "render": true }
    const originator = game.user.id;
    let newMessage = new ChatMessage(content, chatData);
    Hooks.call("preCreateChatMessage", newMessage, chatData, options, originator);
    this.database.push(newMessage);
    Hooks.call("createChatMessage", newMessage, options, originator);
  }

  static get implementation() {
    return CONFIG[this.documentName]?.documentClass || this;
  }

  static getSpeaker() {
    return {
      actor: null,
      alias: game.user.name
    };
  }

  static reset() {
    this.database = [];
  }
}

export default ChatMessage;

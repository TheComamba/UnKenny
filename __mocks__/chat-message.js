import BaseChatMessage from './base-chat-message.js';
import game from './game.js';
import Hooks from './hooks.js';

class ChatMessage extends BaseChatMessage {
  static create(chatData) {
    const options = { "temporary": false, "renderSheet": false, "render": true }
    const originator = game.user.id;
    let classRef = this.implementation;
    let newMessage = new classRef(chatData);
    Hooks.call("preCreateChatMessage", newMessage, chatData, options, originator);
    newMessage._preCreate(chatData, options, originator);
    Hooks.call("createChatMessage", newMessage, options, originator);
    game.messages.set(newMessage.id, newMessage);
  }

  static get implementation() {
    return CONFIG[this.documentName]?.documentClass || this;
  }

  static get documentName() {
    return this.name;
  }

  static getSpeaker() {
    return {
      actor: null,
      alias: game.user.name
    };
  }

  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    if (typeof data.content === "string") {
      let content = data.content;
      this.updateSource({ content });
    }
  }

  _initialize(options = {}) {
    super._initialize(options);
    this.data = this.data || {};
    this.data.flags = {};
    this.data.speaker = this.constructor.getSpeaker();
  }
}

export default ChatMessage;

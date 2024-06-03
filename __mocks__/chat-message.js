import BaseChatMessage from './base-chat-message.js';
import Hooks from './hooks.js';

class ChatMessage extends BaseChatMessage {
  static database = [];

  constructor(content, chatData) {
    super();
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
    let classRef = this.implementation;
    let newMessage = new classRef(content, chatData);
    Hooks.call("preCreateChatMessage", newMessage, chatData, options, originator);
    newMessage._preCreate(chatData, options, originator);
    Hooks.call("createChatMessage", newMessage, options, originator);
    this.database.push(newMessage);
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

  _preCreate(data, options, user) {
    if (typeof data.content === "string") {
      let content = data.content;
      this.updateSource({content});
    }
  }

  updateSource(changes={}, options={}) {
    for (let [k, v] of Object.entries(changes)) {
      this[k] = v;
    }
    this._initialize();
  }

  _initialize(options={}) {
    super._initialize(options);
    this.data = this.data || {};
    this.data.flags = {};
    this.data.speaker = this.constructor.getSpeaker();
  }

  static reset() {
    this.database = [];
  }
}

export default ChatMessage;

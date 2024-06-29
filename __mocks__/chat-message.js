import $ from 'jquery';
import BaseChatMessage from './base-chat-message.js';
import game from './game.js';
import Hooks from './hooks.js';
import { generateRandomId } from './utils.js';

class ChatMessage extends BaseChatMessage {
  static async create(chatData) {
    const options = { "temporary": false, "renderSheet": false, "render": true }
    const originator = game.user.id;
    let classRef = this.implementation;
    let newMessage = new classRef(chatData);
    Hooks.call("preCreateChatMessage", newMessage, chatData, options, originator);
    await newMessage._preCreate(chatData, options, originator);
    Hooks.call("createChatMessage", newMessage, options, originator);
    newMessage.id = generateRandomId();
    game.messages.set(newMessage.id, newMessage);
    let _html = newMessage.getHTML(); // This operation is not directly called in Foundry, but it also not awaited.
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
    this.user = user;
    if (typeof data.content === "string") {
      let content = data.content;
      this.updateSource({ content });
    }
  }

  async getHTML() {
    let title = this.speaker.alias ?? this.user.name;
    let subtitle = this.speaker.alias ? this.user.name : "";
    const htmlString = `
    <li class="chat-message message flexcol " data-message-id="${this.id}" style="border-color:#2ecc28">
      <header class="message-header flexrow">
        <h4 class="message-sender">
          <a class="avatar">
            <img src="icons/svg/mystery-man.svg" alt="${speaker}">
          </a>
          <span class="name-stacked">
            <span class="title">
              ${title}
            </span>
            <span class="subtitle">
              ${subtitle}
            </span>
          </span>
        </h4>
        <span class="message-metadata">
          <time class="message-timestamp">
            15m ago
          </time>
          <a aria-label="Additional Controls" class="chat-control" data-context-menu="">
            <i class="fas fa-ellipsis-vertical fa-fw">
            </i>
          </a>
        </span>
      </header>
      <div class="message-content">
        ${this.data.content}
      </div>
    </li>`;
    let html = $(htmlString);
    Hooks.call("renderChatMessage", this, html, this.data);
    return html;
  }

  _initialize(options = {}) {
    super._initialize(options);
    this.data = this.data || {};
    this.data.flags = {};
    this.data.speaker = this.constructor.getSpeaker();
  }
}

export default ChatMessage;

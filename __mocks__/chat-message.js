import $ from 'jquery';
import BaseChatMessage from './base-chat-message.js';
import game from './game.js';
import Hooks from './hooks.js';
import { generateRandomId } from './utils.js';
import { JSDOM } from 'jsdom';

export default class ChatMessage extends BaseChatMessage {
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
    let speaker = this.speaker;
    let sender = speaker ? speaker.alias : this.user.name;
    const htmlString = `
    <document>
      <header class="message-header flexrow">
          <h4 class="message-sender">
            ${sender}
          </h4>
          <span class="message-metadata">
              <time class="message-timestamp">
                30m ago
              </time>
              <a aria-label="Delete" class="message-delete">
                <i class="fas fa-trash">
                </i>
              </a>
          </span>
      </header>
      <div class="message-content">
          ${this.data.content}
      </div>
    </document>
`;
    const dom = new JSDOM(htmlString);
    const window = dom.window;
    let html = $(window)(htmlString);
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

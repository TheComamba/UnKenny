import { getConversationWithFlagSync } from "./collecting-chat-messages.js";

function getNameOfActor(id) {
  for (let actor of game.actors) {
    if (actor.id === id) {
      return actor.name;
    }
  }
  ui.notifications.error(`Actor with id "${id}" not found. Has it been deleted?`);
}

function adjustHtml(message, html) {
  const conversationWith = getConversationWithFlagSync(message);
  if (!conversationWith) {
    return;
  }
  const hasSpeaker = message.speaker?.actor === conversationWith;

  let audience;
  if (hasSpeaker) {
    audience = message.user.name;
  } else {
    audience = getNameOfActor(conversationWith);
  }

  if (!audience) {
    return;
  }

  let unkennyMarker = `
      <p style="opacity: 0.5; font-size: 10px;">
        Speaking with ${audience}
      </p>
    `;

  let messageContent = html.find('.message-content')
  if (messageContent) {
    messageContent.prepend(unkennyMarker);
  }
}

export { adjustHtml };
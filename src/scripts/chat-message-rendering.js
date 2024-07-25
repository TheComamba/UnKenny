import { getConversationWithFlagSync } from "./collecting-chat-messages.js";

function getNameOfActor(id) {
  for (let actor of game.actors) {
    if (actor.id === id) {
      return actor.name;
    }
  }
  ui.notifications.error(game.i18n.localize("unkenny.chatMessage.actorIdNotFound", { id: id }));
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
        ${game.i18n.localize("unkenny.chatMessage.marker", { audience: audience })}
      </p>
    `;

  let messageContent = html.find('.message-content')
  if (messageContent) {
    messageContent.prepend(unkennyMarker);
  }
}

export { adjustHtml };
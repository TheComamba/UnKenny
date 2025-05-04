export default class ChatLog {
    async processMessage(message, {speaker}={}) {
        message = message.trim();
        if ( !message ) return;
        const chatMessageClass = ChatMessage.implementation;
        const chatData = {
            user: game.user.id,
            speaker: speaker ?? chatMessageClass.getSpeaker()
          };
        chatData.content = message;
        Hooks.call('chatMessage', this, message, chatData);
        return chatMessageClass.create(chatData); // no await here
    }
}

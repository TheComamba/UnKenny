function respondInChat(actor, text) {
    let params = {
        content: `<p><b>${actor.name}:</b></p><p>${text}</p>`,
        type: 1,
        user: actor.id
    }
    ChatMessage.create(params);
}

export { respondInChat };
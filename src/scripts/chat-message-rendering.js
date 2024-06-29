function adjustHtml(message, html) {
    let audience = 'TODO';
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
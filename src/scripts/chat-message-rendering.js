function adjustHtml(message, html) {
    let audience = 'TODO';
    let unkennyMarker = `
      <p style="opacity: 0.5; font-size: 10px;">
        Speaking with ${audience}
      </p>
    `;
    html.find('.message-content').prepend(unkennyMarker);
}

export { adjustHtml };
// Ensure jQuery is loaded
if (typeof $ === 'undefined') {
    console.error('jQuery is not loaded');
} else {
    console.log('jQuery is loaded');
}

// Listen for key events in the chat input field
Hooks.on('renderChatLog', (app, html, data) => {
    const inputField = html.find('textarea#chat-message');
    if (inputField.length === 0) {
        console.error('Chat input field not found');
        return;
    }
    console.log('Chat input field found');

    inputField.on('input', async (event) => {
        const value = inputField.val();
        const atIndex = value.lastIndexOf('@');
        if (atIndex !== -1) {
            const query = value.substring(atIndex + 1).toLowerCase();
            const aliases = await getAllActorAliases();
            const filteredAliases = aliases.filter(alias => alias.toLowerCase().startsWith(query));
            showAutocompletePopup(inputField, filteredAliases);
        } else {
            $('.autocomplete-popup').remove();
        }
    });

    // Close the popup if clicking outside of it
    $(document).on('click', (event) => {
        if (!$(event.target).closest('.autocomplete-popup').length && !$(event.target).is(inputField)) {
            $('.autocomplete-popup').remove();
        }
    });
});

// Function to fetch all actor aliases
async function getAllActorAliases() {
    const actors = game.actors;
    const aliases = await Promise.all(actors.map(async actor => {
        return await actor.getFlag("unkenny", "alias");
    }));
    return aliases.filter(alias => alias); // Filter out null or undefined aliases
}

// Function to show the autocomplete popup
function showAutocompletePopup(inputField, aliases) {
    $('.autocomplete-popup').remove(); // Remove existing popup

    if (aliases.length === 0) {
        console.log('No aliases found');
        return;
    }

    // Sort aliases alphabetically
    aliases.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Create a popup element
    const popup = $('<div class="autocomplete-popup"></div>');
    popup.css({
        background: 'white',
        border: '1px black solid',
        zIndex: 30,
        maxHeight: '150px',
        overflowY: 'auto',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        position: 'absolute',
        width: inputField.outerWidth()
    });

    aliases.forEach((alias) => {
        const item = $(`<div class="autocomplete-item">${alias}</div>`);
        item.css({
            padding: '5px',
            cursor: 'pointer'
        });
        item.on('mouseenter', () => item.css({
            backgroundColor: 'royalblue',
            color: 'white'
        }));
        item.on('mouseleave', () => item.css({
            backgroundColor: '',
            color: ''
        }));
        item.on('click', () => {
            selectAlias(inputField, alias);
            inputField.focus(); // Refocus the input field after selection
        });
        popup.append(item);
    });

    // Position the popup relative to the bottom of the input field
    const offset = inputField.offset();
    const inputHeight = inputField.outerHeight();
    popup.css({
        left: offset.left,
        bottom: $(window).height() - offset.top - inputHeight + 100 // Adjusted to position from the bottom with a small gap
    });

    // Append the popup to the body
    $('body').append(popup);
    console.log('Popup appended:', popup);
}

// Function to select an alias and insert it into the input field
function selectAlias(inputField, alias) {
    const value = inputField.val();
    const atIndex = value.lastIndexOf('@');
    inputField.val(value.substring(0, atIndex + 1) + alias + ' ');
    $('.autocomplete-popup').remove();
}
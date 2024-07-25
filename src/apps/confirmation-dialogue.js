function confirmationDialog({ title, content, yesCallback, noCallback, defaultYes = true }) {
    new Dialog({
        title: title || game.i18n.localize("unkenny.confirmation.title"),
        content: content || "<p>" + game.i18n.localize("unkenny.confirmation.question") + "</p>",
        buttons: {
            yes: {
                icon: '<i class="fas fa-check"></i>',
                label: game.i18n.localize("unkenny.confirmation.yes"),
                callback: yesCallback || (() => console.log(game.i18n.localize("unkenny.confirmation.confirmed")))
            },
            no: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("unkenny.confirmation.no"),
                callback: noCallback || (() => console.log(game.i18n.localize("unkenny.confirmation.cancelled")))
            }
        },
        default: defaultYes ? "yes" : "no"
    }).render(true);
}

export { confirmationDialog };

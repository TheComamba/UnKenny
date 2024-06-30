function confirmationDialog({ title, content, yesCallback, noCallback, defaultYes = true }) {
    new Dialog({
        title: title || "Confirmation",
        content: content || "<p>Are you sure?</p>",
        buttons: {
            yes: {
                icon: '<i class="fas fa-check"></i>',
                label: "Yes",
                callback: yesCallback || (() => console.log("Confirmed"))
            },
            no: {
                icon: '<i class="fas fa-times"></i>',
                label: "No",
                callback: noCallback || (() => console.log("Cancelled"))
            }
        },
        default: defaultYes ? "yes" : "no"
    }).render(true);
}

export { confirmationDialog };

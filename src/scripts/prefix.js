const PREFIX_OPTIONS = {
    none: "",
    talk: "/talk ",
};

async function prefixResponse(response, parameters) {
    if (!parameters.prefix) {
        return response;
    }

    let prefix = PREFIX_OPTIONS[parameters.prefix];
    if (!prefix) {
        const warningMessage = game.i18n.format("unkenny.prefix.invalid", { prefix: parameters.prefix });
        ui.notifications.warn(warningMessage);
        prefix = "";
    }

    return prefix + response;
}

export { PREFIX_OPTIONS, prefixResponse };

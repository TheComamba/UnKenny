const PREFIX_OPTIONS = {
    none: "",
    talk: "/talk ",
};

function isEmptyPrefix(prefix) {
    return !prefix || prefix === PREFIX_OPTIONS.none;
}

async function prefixResponse(response, parameters) {
    if (isEmptyPrefix(parameters.prefix)) {
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

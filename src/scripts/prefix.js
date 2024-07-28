const PREFIX_OPTIONS = {
    none: "",
    whisper: "/whisper <user> ",
    talk: "/talk ",
};

function isEmptyPrefix(prefix) {
    return !prefix || prefix === "none";
}

function replacePlaceholders(prefix) {
    return prefix.replace("<user>", game.user.name);
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

    prefix = replacePlaceholders(prefix);

    return prefix + response;
}

export { PREFIX_OPTIONS, prefixResponse, replacePlaceholders };

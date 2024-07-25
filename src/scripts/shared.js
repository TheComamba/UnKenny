const loadedModules = {}

async function isUnkenny(actor) {
    if (!actor) {
        const errorMessage = game.i18n.localize("unkenny.shared.unkenninessForNull");
        ui.notifications.error(errorMessage);
        return false;
    }
    let alias = await actor.getFlag("unkenny", "alias");
    return !!alias;
}

function isTestEnvironment() {
    if (typeof process === 'undefined') {
        return false;
    }
    return process.env.NODE_ENV === 'test';
}

async function loadExternalModule(name) {
    if (loadedModules[name]) {
        return loadedModules[name];
    }
    try {
        let nameForUrl = name;
        if (nameForUrl == "openai") {
            nameForUrl += "/+esm";
        }
        loadedModules[name] = await import('https://cdn.jsdelivr.net/npm/' + nameForUrl);
        return loadedModules[name];
    } catch (error) {
        if (isTestEnvironment()) {
            try {
                return await import(name);
            } catch (localError) {
                const errorMessage = game.i18n.format("unkenny.shared.moduleLoadFailed", { name: name, error: error });
                console.error(errorMessage);
                return;
            }
        } else {
            const errorMessage = game.i18n.format("unkenny.shared.moduleLoadFailed", { name: name, error: error });
            ui.notifications.error(errorMessage);
            return;
        }
    }
}

export { isUnkenny, loadExternalModule };

const loadedModules = {}

async function isUnkenny(actor) {
    if (!actor) {
        ui.notifications.error("Unkennyness checked for null actor.");
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
        loadedModules[name] = await import('https://cdn.jsdelivr.net/npm/' + name);
        return loadedModules[name];
    } catch (error) {
        if (isTestEnvironment()) {
            try {
                return await import(name);
            } catch (localError) {
                console.error("Unable to load local module " + name + ": " + localError);
                return;
            }
        } else {
            ui.notifications.error("Unable to load module: " + error);
            return;
        }
    }
}

export { isUnkenny, loadExternalModule };

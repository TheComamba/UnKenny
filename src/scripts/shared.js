const moduleNameToVersion = {
    "openai": "4.22.1/+esm",
    "@xenova/transformers": "2.17.1",
};

async function isUnkenny(actor) {
    if (!actor) {
        ui.notifications.error("Unkennyness checked for null actor.");
        return false;
    }
    let alias = await actor.getFlag("unkenny", "alias");
    return !!alias;
}

async function loadExternalModule(name) {
    try {
        let version = moduleNameToVersion[name];
        return await import('https://cdn.jsdelivr.net/npm/' + name + '@' + version);
    } catch (error) {
        if (process.env.NODE_ENV === 'test') {
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

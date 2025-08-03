import game from '../__mocks__/game.js';
import { getModelsByType, getModelType } from '../src/scripts/models.js';

const oneMinute = 60 * 1000;

function complainIfEnvVariableIsMissing(variableName) {
    if (!process.env[variableName]) {
        it(variableName + ' is not set', () => {
            let errorText = `The ${variableName} environment variable is not set.`;
            errorText += ` Before running OpenAI API tests, run (in bash):\n`
            errorText += `export ${variableName}=<your-api-key>\n`;
            errorText += `Alternatively, you can set add a file called ".env" and add the line \n`;
            errorText += `${variableName}=<your-api-key>\n`;
            throw new Error(errorText);
        });
    }
}

function testIfModelsEnabled(name, fn) {
    const runsRemoteTests = process.env.RUN_REMOTE_TESTS === 'true';
    const runsLocalTests = process.env.RUN_LOCAL_TESTS === 'true';
    if (runsRemoteTests) {
        complainIfEnvVariableIsMissing('OPENAI_API_KEY');
        complainIfEnvVariableIsMissing('GOOGLE_API_KEY');
        return it(name, fn).timeout(oneMinute);
    } else if (runsLocalTests) {
        return it(name, fn).timeout(oneMinute);
    } else {
        return it.skip(name, fn);
    }
}

function setupLocalModels() {
    game.settings.set('unkenny', 'customModel', 'llama3.2');
    game.settings.set('unkenny', 'baseUrl', 'http://localhost:11434');
}

function getAvailableModels() {
    const runsRemoteTests = process.env.RUN_REMOTE_TESTS === 'true';
    const runsLocalTests = process.env.RUN_LOCAL_TESTS === 'true';
    let models = [];
    if (runsRemoteTests) {
        const openaiModels = getModelsByType('openai');
        const googleModels = getModelsByType('google');
        models = [...models, ...openaiModels, ...googleModels];
    }
    if (runsLocalTests) {
        setupLocalModels();
        const localModels = getModelsByType('custom');
        models = [...models, ...localModels];
    }
    return models;
}

function getApiKey(model) {
    const type = getModelType(model);
    if (type === "openai") {
        return process.env.OPENAI_API_KEY;
    } else if (type === "google") {
        return process.env.GOOGLE_API_KEY;
    } else if (type === "custom") {
        return "";
    }
    throw new Error("Unknown model: " + model);
}

function waitFor(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 100);
    }
    return new Promise(poll);
}

async function waitForMessagesToBePosted(number) {
    await waitFor(() => {
        return game.messages.size === number || // Happy path
            ui.notifications.warn.called || // Sad path
            ui.notifications.error.called; // Sad path
    });
}

async function findFirstMessageConcerning(actor) {
    for (let m of game.messages) {
        const flag = await m.getFlag('unkenny', CONVERSATION_FLAG);
        if (flag === actor.id) {
            return m;
        }
    }
    return null;
}

function expectNoNotifications() {
    if (ui.notifications.warn.called) {
        const warning = ui.notifications.warn.getCall(0).args[0];
        throw new Error("Warning has been called:\n" + warning);
    }
    if (ui.notifications.error.called) {
        const error = ui.notifications.error.getCall(0).args[0];
        throw new Error("Error has been called:\n" + error);
    }
}

export {
    expectNoNotifications,
    findFirstMessageConcerning,
    getApiKey,
    getAvailableModels,
    setupLocalModels,
    testIfModelsEnabled,
    waitFor,
    waitForMessagesToBePosted
};

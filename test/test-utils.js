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

function testIfOpenAi(name, fn) {
    const shouldRunOpenAiTests = process.env.RUN_OPENAI_TESTS === 'true';
    if (shouldRunOpenAiTests) {
        complainIfEnvVariableIsMissing('OPENAI_API_KEY');
        complainIfEnvVariableIsMissing('GOOGLE_API_KEY');
        return it(name, fn).timeout(oneMinute);
    } else {
        return it.skip(name, fn);
    }
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

export { expectNoNotifications, findFirstMessageConcerning, testIfOpenAi, waitFor, waitForMessagesToBePosted };

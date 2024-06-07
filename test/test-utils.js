const oneMinute = 60 * 1000;

function testIfSlow(name, fn) {
    const shouldRunSlowTests = process.env.RUN_SLOW_TESTS === 'true';
    if (shouldRunSlowTests) {
        return it(name, fn).timeout(oneMinute);
    } else {
        return it.skip(name, fn);
    }
}

function testIfOpenAi(name, fn) {
    const shouldRunOpenAiTests = process.env.RUN_OPENAI_TESTS === 'true';
    if (shouldRunOpenAiTests) {
        if (!process.env.OPENAI_API_KEY) {
            it(name, () => {
                let errorText = 'The OPENAI_API_KEY environment variable is not set.';
                errorText += 'Before running OpenAI API tests, run:\n'
                errorText += 'export OPENAI_API_KEY=<your-api-key>\n';
                errorText += 'Alternatively, you can set add a file called ".env" and add the line \n';
                errorText += 'OPENAI_API_KEY=<your-api-key>\n';
                errorText += 'to it.';
                throw new Error(errorText);
            });
        }
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

async function findFirstMessageConcerning(actor) {
    for (let m of game.messages) {
        const flag = await m.getFlag('unkenny', 'conversationWith');
        if (flag === actor.id) {
            return m;
        }
    }
    return null;
}

export { findFirstMessageConcerning, testIfOpenAi, testIfSlow, waitFor };

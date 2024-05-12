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
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            it(name, () => {
                throw new Error('OPENAI_API_KEY environment variable is not set.');
            });
        }
        game.settings.set('unkenny', 'apiKey', apiKey);
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

export { testIfOpenAi, testIfSlow, waitFor };

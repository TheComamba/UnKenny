function testIfSlow(name, fn) {
    const oneMinute = 60 * 1000;
    const shouldRunSlowTests = process.env.RUN_SLOW_TESTS === 'true';
    return (shouldRunSlowTests ? it : it.skip)(name, fn).timeout(oneMinute);
}

function waitFor(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 100);
    }
    return new Promise(poll);
}

export { testIfSlow, waitFor };

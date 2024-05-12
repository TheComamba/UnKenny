function testIfSlow(name, fn) {
    const fiveMinutes = 5 * 60 * 1000;
    const shouldRunSlowTests = process.env.RUN_SLOW_TESTS === 'true';
    return (shouldRunSlowTests ? it : it.skip)(name, fn).timeout(fiveMinutes);
}

export { testIfSlow };

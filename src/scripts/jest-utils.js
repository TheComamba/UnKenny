function testIfSlow(name, fn) {
    const fiveMinutes = 5 * 60 * 1000;
    const shouldRunSlowTests = process.env.RUN_SLOW_TESTS === 'true';
    return (shouldRunSlowTests ? test : test.skip)(name, fn, fiveMinutes);
}

export { testIfSlow };

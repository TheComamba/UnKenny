function testIfSlow(name, fn) {
    const shouldRunSlowTests = process.env.RUN_SLOW_TESTS === 'true';
    return (shouldRunSlowTests ? test : test.skip)(name, fn);
}

export { testIfSlow };

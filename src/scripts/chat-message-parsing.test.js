let rewire = require('rewire');
let testedModule = rewire('./chat-message-parsing.js');

describe('findAdressedAlias', () => {
    it('should return null if no alias is addressed', () => {
        const findAdressedAlias = testedModule.__get__('findAdressedAlias');
        const message = "Kapascardia";
        const result = findAdressedAlias(message);
        expect(result).toBeNull();
    });

    it('should return the alias if it is addressed at the beginning of the message', () => {
        const findAdressedAlias = testedModule.__get__('findAdressedAlias');
        const message = "/alias Kapascardia";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return the alias if it is addressed anywhere in the message', () => {
        const findAdressedAlias = testedModule.__get__('findAdressedAlias');
        const message = "Kapascardia @alias funurkel";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return the alias in lowercase', () => {
        const findAdressedAlias = testedModule.__get__('findAdressedAlias');
        const message = "Kapascardia @Alias funurkel";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return the alias if it is addressed at the end of the message', () => {
        const findAdressedAlias = testedModule.__get__('findAdressedAlias');
        const message = "Kapascardia @alias";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return only the first alias if multiple aliases are addressed', () => {
        const findAdressedAlias = testedModule.__get__('findAdressedAlias');
        const message = "Kapascardia @alias1 @alias2 @alias3";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias1');
    });
});

import { findAdressedAlias } from '../src/scripts/chat-message-parsing.js';

describe('findAdressedAlias', () => {
    it('should return null if no alias is addressed', () => {
        const message = "Kapascardia";
        const result = findAdressedAlias(message);
        expect(result).toBeNull();
    });

    it('should return the alias if it is addressed at the beginning of the message', () => {
        const message = "/alias Kapascardia";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return the alias if it is addressed anywhere in the message', () => {
        const message = "Kapascardia @alias funurkel";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return the alias in lowercase', () => {
        const message = "Kapascardia @Alias funurkel";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return the alias if it is addressed at the end of the message', () => {
        const message = "Kapascardia @alias";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias');
    });

    it('should return only the first alias if multiple aliases are addressed', () => {
        const message = "Kapascardia @alias1 @alias2 @alias3";
        const result = findAdressedAlias(message);
        expect(result).toBe('alias1');
    });
});

import { replaceAlias } from '../src/scripts/chat-message-parsing.js';

describe('replaceAlias', () => {
    it('should return the original message if alias is empty', () => {
        const message = "Hello @alias, how are you?";
        const result = replaceAlias(message, "", "John");
        expect(result).toBe(message);
    });

    it('should remove the slash-alias at the beginning of the message', () => {
        const message = "/alias How are you?";
        const result = replaceAlias(message, "alias", "John");
        expect(result).toBe("How are you?");
    });

    it('should replace the alias anywhere in the message with actor name', () => {
        const message = "Hello @alias, how are you?";
        const result = replaceAlias(message, "alias", "John");
        expect(result).toBe("Hello <b>John</b>, how are you?");
    });

    it('should replace the alias in case insensitive manner', () => {
        const message = "Hello @Alias, how are you?";
        const result = replaceAlias(message, "alias", "John");
        expect(result).toBe("Hello <b>John</b>, how are you?");
    });

    it('should replace all occurrences of the alias in the message', () => {
        const message = "@Malkovich @Malkovich @Malkovich";
        const result = replaceAlias(message, "Malkovich", "John");
        expect(result).toBe("<b>John</b> <b>John</b> <b>John</b>");
    });
});

import { actorHasAlias } from '../src/scripts/chat-message-parsing.js';

describe('actorHasAlias', () => {
    let actor;
    let consoleSpy;

    beforeEach(() => {
        actor = new Actor();
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should return false when alias is empty string', () => {
        expect(actorHasAlias(actor, '')).toBe(false);
    });

    it('should return false when actor has no alias set', () => {
        expect(actorHasAlias(actor, 'John Doe')).toBe(false);
    });

    it('should return true when actor has alias set', () => {
        actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(actorHasAlias(actor, 'John Doe')).toBe(true);
    });

    it('should return true when actor has alias set, regardless of case', () => {
        actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(actorHasAlias(actor, 'john doe')).toBe(true);
        expect(actorHasAlias(actor, 'JOHN DOE')).toBe(true);
    });

    it('should return false when actor has different alias set', () => {
        actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(actorHasAlias(actor, 'Jane Doe')).toBe(false);
    });

    it('should return false when actor has alias set but queried with empty string', () => {
        actor.setFlag('unkenny', 'alias', 'John Doe');
        expect(actorHasAlias(actor, '')).toBe(false);
    });

    it('should log an error when actor is null', () => {
        actorHasAlias(null, 'John Doe');
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log an error when alias is not a string', () => {
        actorHasAlias(actor, 123);
        expect(consoleSpy).toHaveBeenCalled();
    });
});

import { findAdressedActor } from '../src/scripts/chat-message-parsing.js';

describe('findAdressedActor', () => {
    let ui;

    beforeEach(() => {
        ui = {
            notifications: {
                error: jest.fn()
            }
        };
        global.game.reset()
        global.ui = ui;
    });

    it('should return null when no alias is addressed', () => {
        const actor = new Actor();
        actor.setFlag('unkenny', 'alias', 'alias');
        global.game.addActor(actor);

        const message = "Kapascardia";
        const result = findAdressedActor(message);
        expect(result).toBeNull();
    });

    it('should return null and display an error when actor with alias is not found', () => {
        const actor = new Actor();
        actor.setFlag('unkenny', 'alias', 'other-alias');
        global.game.addActor(actor);

        const message = "Kapascardia @alias";
        const result = findAdressedActor(message);
        expect(result).toBeNull();
        expect(ui.notifications.error).toHaveBeenCalled();
    });

    it('should return the actor when alias is addressed', () => {
        const actor = new Actor();
        actor.setFlag('unkenny', 'alias', 'alias');
        global.game.addActor(actor);

        const message = "/alias Kapascardia";
        const result = findAdressedActor(message);
        expect(result).toBe(actor);
    });
});

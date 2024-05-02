import { jest } from '@jest/globals';
import { isUnkenny } from './shared.js';

describe('isUnkenny', () => {
    let ui;
    beforeEach(() => {
        ui = {
            notifications: {
                error: jest.fn()
            }
        };
        global.ui = ui;
    });

    it('should return false and show error when actor is null', () => {
        const result = isUnkenny(null);
        expect(result).toBe(false);
        expect(ui.notifications.error).toHaveBeenCalledWith("Unkennyness checked for null actor.");
    });

    it('should return false when actor does not have unkenny flag', () => {
        const actor = new Actor();
        expect(isUnkenny(actor)).toBe(false);
    });

    it('should return true when actor has unkenny flag', () => {
        const actor = new Actor();
        actor.setFlag("unkenny", "alias", 'some-alias');
        expect(isUnkenny(actor)).toBe(true);
    });
});
// Path: src/scripts/chat-message-parsing.test.js
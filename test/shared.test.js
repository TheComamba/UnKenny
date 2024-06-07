import { expect } from 'chai';
import { isUnkenny } from '../src/scripts/shared.js';

describe('isUnkenny', () => {
    beforeEach(() => {
        ui.reset();
    });

    it('should return false and show error when actor is null', async () => {
        const result = await isUnkenny(null);
        expect(result).to.equal(false);
        expect(ui.notifications.error.called).to.be.true;
    });

    it('should return false when actor does not have unkenny flag', async () => {
        const actor = new Actor();
        expect(await isUnkenny(actor)).to.equal(false);
    });

    it('should return true when actor has unkenny flag', async () => {
        const actor = new Actor();
        await actor.setFlag("unkenny", "alias", 'some-alias');
        expect(await isUnkenny(actor)).to.equal(true);
    });
});

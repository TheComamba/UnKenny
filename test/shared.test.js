import { expect } from 'chai';
import { isUnKenny } from '../src/scripts/shared.js';
import mockReset from '../__mocks__/main.js';
import { expectNoNotifications } from './test-utils.js';

describe('isUnKenny', function () {
    beforeEach(() => {
        mockReset();
    });

    it('should return false and show error when actor is null', async () => {
        const result = await isUnKenny(null);
        expect(result).to.equal(false);
        expect(ui.notifications.error.called).to.be.true;
    });

    it('should return false when actor does not have unkenny flag', async () => {
        const actor = new Actor();
        expect(await isUnKenny(actor)).to.equal(false);
        expectNoNotifications();
    });

    it('should return true when actor has unkenny flag', async () => {
        const actor = new Actor();
        await actor.setFlag("unkenny", "alias", 'some-alias');
        expect(await isUnKenny(actor)).to.equal(true);
        expectNoNotifications();
    });
});

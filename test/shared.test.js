import { expect } from 'chai';
import { isUnkenny, postInChat } from '../src/scripts/shared.js';

describe('isUnkenny', () => {
    beforeEach(() => {
        ui.reset();
    });

    it('should return false and show error when actor is null', () => {
        const result = isUnkenny(null);
        expect(result).to.equal(false);
        expect(ui.notifications.error.called).to.be.true;
    });

    it('should return false when actor does not have unkenny flag', () => {
        const actor = new Actor();
        expect(isUnkenny(actor)).to.equal(false);
    });

    it('should return true when actor has unkenny flag', () => {
        const actor = new Actor();
        actor.setFlag("unkenny", "alias", 'some-alias');
        expect(isUnkenny(actor)).to.equal(true);
    });
});

describe('postInChat', () => {
    beforeEach(() => {
        ui.reset();
    });

    it('should post message in chat when originator is User', () => {
        const user_id = '60d7213e4f5f2b6';
        postInChat(user_id, 'some message');
        expect(ChatMessage.create.called).to.be.true;
        expect(ui.notifications.error.called).to.be.false;
    });

    it('should post message in chat when originator is Actor', () => {
        const actor = new Actor();
        postInChat(actor, 'some message');
        expect(ChatMessage.create.called).to.be.true;
        expect(ui.notifications.error.called).to.be.false;
    });

    it('should show error when originator is not User or Actor', () => {
        postInChat(null, 'some message');
        expect(ChatMessage.create.called).to.be.false;
        expect(ui.notifications.error.called).to.be.true;
    });

    it('should not post message in chat when chatMessage hook returns false', () => {
        Hooks.call.withArgs("chatMessage").returns(false);
        postInChat(new User(), 'some message');
        expect(ChatMessage.create.called).to.be.false;
        expect(ui.notifications.error.called).to.be.false;
    });
});

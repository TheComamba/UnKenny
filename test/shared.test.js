import { expect } from 'chai';
import sinon from 'sinon';
import { isUnkenny, postInChat } from '../src/scripts/shared.js';
import ChatMessage from '../__mocks__/chat-message.js';

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
    let spy = sinon.spy(ChatMessage.prototype, 'create');
    beforeEach(() => {
        ui.reset();
        spy.restore();
    });

    it('should post message in chat when originator is String', () => {
        const user_id = '60d7213e4f5f2b6';
        postInChat(user_id, 'some message');
        sinon.assert.calledOnce(spy);
        expect(ui.notifications.error.called).to.be.false;
    });

    it('should post message in chat when originator is Actor', () => {
        const actor = new Actor();
        postInChat(actor, 'some message');
        sinon.assert.calledOnce(spy);
        expect(ui.notifications.error.called).to.be.false;
    });

    it('should show error when originator is not String or Actor', () => {
        postInChat(null, 'some message');
        sinon.assert.notCalled(spy);
        expect(ui.notifications.error.called).to.be.true;
    });

    it('should not post message in chat when chatMessage hook returns false', () => {
        Hooks.on("chatMessage", (_log, _text, _data) => false);
        const actor = new Actor();
        postInChat(actor, 'some message');
        sinon.assert.notCalled(spy);
        expect(ui.notifications.error.called).to.be.false;
    });
});

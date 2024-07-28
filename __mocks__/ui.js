import sinon from 'sinon';
import ChatLog from './chat-log.js';

const ui = {
    chat: new ChatLog(),
    notifications: {
        warn: sinon.stub(),
        error: sinon.stub()
    },
    reset: function () {
        this.notifications.warn.reset();
        this.notifications.error.reset();
    }
};

export default ui;

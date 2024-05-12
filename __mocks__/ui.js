import sinon from 'sinon';

const ui = {
    notifications: {
        warning: sinon.stub(),
        error: sinon.stub()
    },
    reset: function () {
        this.notifications.warning.reset();
        this.notifications.error.reset();
    }
};

export default ui;

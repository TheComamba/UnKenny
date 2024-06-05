

describe('collectPreviousMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return an empty list if there are no previous messages', () => {
        expect(true).to.equal(false);
    });

    it('should return an empty list if there are only messages for another actor', () => {
        expect(true).to.equal(false);
    });

    it('should return only messages adressed at the specified actor', () => {
        expect(true).to.equal(false);
    });
});

describe('sortMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should sort messages by timestamp', () => {
        expect(true).to.equal(false);
    });
});

describe('messagesOrganisedForTemplate', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return preamble and newMessageContent if previousMessages is empty', () => {
        expect(true).to.equal(false);
    });

    it('should assign the "user" role to previous messages posted by the user', () => {
        expect(true).to.equal(false);
    });

    it('should assign the "assistant" role to previous messages posted by the actor', () => {
        expect(true).to.equal(false);
    });

    it('should display an error if the actor has no preamble', () => {
        expect(true).to.equal(false);
    });
});

describe('collectChatMessages', () => {
    beforeEach(() => {
        game.reset();
        ui.reset();
    });

    it('should return a chat template list including previously posted messages', () => {
        expect(true).to.equal(false);
    });
});
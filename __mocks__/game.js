const game = {
    actors: [],
    addActor: function (actor) {
        this.actors.push(actor);
    },
    reset: function () {
        this.actors = [];
    }
};

export default game;
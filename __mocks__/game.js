const game = {
    actors: [],
    addActor: function (actor) {
        this.actors.push(actor);
    },
    reset: function () {
        this.actors = [];
    }
};
// TODO: Add settings field to game.
export default game;
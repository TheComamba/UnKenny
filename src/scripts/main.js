Hooks.on("preCreateActor", (actor, input, moreInput, id) => {
    console.log(actor);
    console.log(input);
    console.log(moreInput);
    console.log(id);
});

Hooks.on("createActor", (actor, input,  id) => {
    console.log(actor);
    console.log(input);
    console.log(id);
});

Hooks.on("renderActorSheet", (sheet, init, properties) => {
    console.log(sheet);
    console.log(init);
    console.log(properties);
});
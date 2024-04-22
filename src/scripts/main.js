import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny, postInChat } from "./shared.js";
import { findAdressedActor, replaceAlias } from "./chat-message-parsing.js";
import { postResponse } from "./llm.js";

// CONFIG.debug.hooks = true;

Hooks.once('init', async function () {
  game.settings.register("unkenny", "model", {
    name: "Large Language Model",
    hint: "TODO",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "a": "Model A",
      "b": "Model B",
    },
    default: "a",
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "apiKey", {
    name: "OpenAI API Key",
    hint: "TODO",
    scope: "world",
    config: true,
    type: String,
    default: "",
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "minNewTokens", {
    name: "Minimum Number of New Tokens",
    hint: "TODO",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1
    },
    default: 50,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "maxNewTokens", {
    name: "Maximum Number of New Tokens",
    hint: "TODO",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1
    },
    default: 50,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "repititionPenalty", {
    name: "Repetition Penalty / Frequency Penalty",
    hint: "TODO",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 10
    },
    default: 50,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "presencePenalty", {
    name: "Presence Penalty",
    hint: "TODO: Only OpenAI",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 10
    },
    default: 50,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "temperature", {
    name: "Temperature",
    hint: "TODO: Only OpenAI",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 2,
      step: 0.01
    },
    default: 1.0,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "topP", {
    name: "Top P",
    hint: "TODO: Only OpenAI",
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0.1,
      max: 1,
      step: 0.01
    },
    default: 0.5,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "prefixWithTalk", {
    name: "Prefix responses with /talk",
    hint: "TODO",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: value => {
      console.log(value)
    }
  });

});

Hooks.on("getActorSheetHeaderButtons", async (sheet, buttons) => {
  let buttonText = isUnkenny(sheet.object) ? "Modify UnKennyness" : "Make UnKenny";
  buttons.unshift({
    label: buttonText,
    class: "modify-unkennyness",
    icon: "fas fa-microchip",
    onclick: () => {
      new UnKennySheet(sheet.object).render(true);
    }
  })
});

Hooks.on("chatMessage", (_chatlog, messageText, chatData) => {
  let actor = findAdressedActor(messageText);
  if (actor) {
    let name = actor.name;
    let alias = actor.getFlag("unkenny", "alias");
    messageText = replaceAlias(messageText, name, name);
    messageText = replaceAlias(messageText, alias, name);
    postInChat(chatData.user, messageText);
    postResponse(actor, messageText);
    return false; //Chat message has been posted by UnKenny.
  } else {
    return true; //Chat message needs to be posted by Foundry.
  }
});

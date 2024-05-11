import { UnKennySheet } from "../apps/unkenny-sheet.js";
import { isUnkenny, postInChat } from "./shared.js";
import { findAdressedActor, replaceAlias } from "./chat-message-parsing.js";
import { llmParametersAndDefaults, postResponse } from "./llm.js";
import { getModelsAsMap } from "./models.js";

// CONFIG.debug.hooks = true;

Hooks.once('init', async function () {
  const params = llmParametersAndDefaults();

  game.settings.register("unkenny", "model", {
    name: "Large Language Model",
    hint: `The default model used by unkenny actors to generate responses.
    Local models run in your browser or FoundryVTT instance, while OpenAI models run on a remote server.
    OpenAI models are much faster and mostly yield better results, but they require an API key to work.`,
    scope: "world",
    config: true,
    type: String,
    choices: getModelsAsMap(),
    default: params.model,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "apiKey", {
    name: "OpenAI API Key",
    hint: `If you want to use OpenAI models, you need to provide an API key here.
    Additionally, your account must have a positive balance.`,
    scope: "world",
    config: true,
    type: String,
    default: params.apiKey,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "minNewTokens", {
    name: "Minimum Number of New Tokens",
    hint: `In large language models, the number of tokens determines the length of the generated text.
    To avoid very short responses, you can set a minimum number of tokens here. Note: This parameter is only considered in local models.`,
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 1,
      max: 100,
      step: 1
    },
    default: params.minNewTokens,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "maxNewTokens", {
    name: "Maximum Number of New Tokens",
    hint: `To avoid overly long responses, you can set a maximum number of tokens here.`,
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 1,
      max: 1000,
      step: 1
    },
    default: params.maxNewTokens,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "repetitionPenalty", {
    name: "Repetition Penalty / Frequency Penalty",
    hint: `The repetition penalty is a number that makes it less likely for a token that has already been generated to be generated again.
    Higher values reduce the likelihood of repetition, negative values increase it.`,
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: -2.0,
      max: 2.0,
      step: 0.01
    },
    default: params.repetitionPenalty,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "temperature", {
    name: "Temperature",
    hint: `Large language models generate text by sampling from a probability distribution over the vocabulary.
    Temperature infuences this distribution:
    With a temperature of 0, the model always chooses the most likely token, while all token become nearly equally likely for very high temperatures.
    Lower values make the model more conservative, higher values make it more creative.`,
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 2,
      step: 0.01
    },
    default: params.temperature,
    onChange: value => {
      console.log(value)
    }
  });

  game.settings.register("unkenny", "prefixWithTalk", {
    name: "Prefix responses with /talk",
    hint: `If this option is checked and the Talking Actors FoundryVTT module is enabled and set up, the model's responses are read out loud by an AI voice.`,
    scope: "world",
    config: true,
    type: Boolean,
    default: params.prefixWithTalk,
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

export default {};

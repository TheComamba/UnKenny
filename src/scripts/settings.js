import { getModelToTextMap } from "./models.js";

function llmParametersAndDefaults() {
    return {
        model: null,
        apiKey: "",
        minNewTokens: 1,
        maxNewTokens: 250,
        repetitionPenalty: 0.0,
        temperature: 1.0,
        prefixWithTalk: false
    };
}

function registerGameParameters() {
    const params = llmParametersAndDefaults();

    game.settings.register("unkenny", "model", {
        name: "Large Language Model",
        hint: `The default model used by unkenny actors to generate responses.
    Local models run in your browser or FoundryVTT instance, while OpenAI models run on a remote server.
    OpenAI models are much faster and mostly yield better results, but they require an API key to work.`,
        scope: "world",
        config: true,
        type: String,
        choices: getModelToTextMap(),
        default: params.model
    });

    game.settings.register("unkenny", "apiKey", {
        name: "OpenAI API Key",
        hint: `If you want to use OpenAI models, you need to provide an API key here.
    Additionally, your account must have a positive balance.`,
        scope: "world",
        config: true,
        type: String,
        default: params.apiKey
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
        default: params.minNewTokens
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
        default: params.maxNewTokens
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
        default: params.repetitionPenalty
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
        default: params.temperature
    });

    game.settings.register("unkenny", "prefixWithTalk", {
        name: "Prefix responses with /talk",
        hint: `If this option is checked and the Talking Actors FoundryVTT module is enabled and set up, the model's responses are read out loud by an AI voice.`,
        scope: "world",
        config: true,
        type: Boolean,
        default: params.prefixWithTalk
    });
}

export { llmParametersAndDefaults, registerGameParameters };

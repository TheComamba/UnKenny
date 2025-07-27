import { getModelToTextMap } from "./models.js";
import { PREFIX_OPTIONS } from "./prefix.js";

function llmParametersAndDefaults() {
    return {
        model: null,
        baseUrl: "",
        openaiApiKey: "",
        googleApiKey: "",
        minNewTokens: 1,
        maxNewTokens: 250,
        repetitionPenalty: 0.0,
        temperature: 1.0,
        prefix: ""
    };
}

function registerGameParameters() {
    const params = llmParametersAndDefaults();

    game.settings.register("unkenny", "model", {
        name: game.i18n.localize("unkenny.settings.model"),
        hint: game.i18n.localize("unkenny.settings.modelDescription"),
        scope: "world",
        config: true,
        type: String,
        choices: getModelToTextMap(),
        default: params.model
    });

    game.settings.register("unkenny", "baseUrl", {
        name: game.i18n.localize("unkenny.settings.baseUrl"),
        hint: game.i18n.localize("unkenny.settings.baseUrlDescription"),
        scope: "world",
        config: true,
        type: String,
        default: params.baseUrl
    });

    game.settings.register("unkenny", "openaiApiKey", {
        name: game.i18n.localize("unkenny.settings.openaiApiKey"),
        hint: game.i18n.localize("unkenny.settings.openaiApiKeyDescription"),
        scope: "world",
        config: true,
        type: String,
        default: params.openaiApiKey
    });

    game.settings.register("unkenny", "googleApiKey", {
        name: game.i18n.localize("unkenny.settings.googleApiKey"),
        hint: game.i18n.localize("unkenny.settings.googleApiKeyDescription"),
        scope: "world",
        config: true,
        type: String,
        default: params.googleApiKey
    });

    game.settings.register("unkenny", "minNewTokens", {
        name: game.i18n.localize("unkenny.settings.minNewTokens"),
        hint: game.i18n.localize("unkenny.settings.minNewTokensDescription"),
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
        name: game.i18n.localize("unkenny.settings.maxNewTokens"),
        hint: game.i18n.localize("unkenny.settings.maxNewTokensDescription"),
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
        name: game.i18n.localize("unkenny.settings.repetitionPenalty"),
        hint: game.i18n.localize("unkenny.settings.repetitionPenaltyDescription"),
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
        name: game.i18n.localize("unkenny.settings.temperature"),
        hint: game.i18n.localize("unkenny.settings.temperatureDescription"),
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

    game.settings.register("unkenny", "prefix", {
        name: game.i18n.localize("unkenny.settings.prefix"),
        hint: game.i18n.localize("unkenny.settings.prefixDescription"),
        scope: "world",
        config: true,
        type: String,
        choices: PREFIX_OPTIONS,
        default: params.prefix
    });
}

export { llmParametersAndDefaults, registerGameParameters };

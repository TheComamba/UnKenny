let AutoModelForCausalLM, AutoTokenizer;

import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1')
    .then(module => {
        AutoModelForCausalLM = module.AutoModelForCausalLM;
        AutoTokenizer = module.AutoTokenizer;
    })
    .catch(error => {
        if (process.env.NODE_ENV === 'test') {
            // Maybe add a mock here
        } else {
            console.error("Unable to load module", error);
        }
    });

import { UnKennyInfo } from '../apps/unkenny-info.js';

const modelCache = new Map();
const tokenizerCache = new Map();

async function getModelAndTokenizer(model_path) {
    let info = new UnKennyInfo(`Preparing model and tokenizer '${model_path}'...`);
    await info.render(true);

    if (modelCache.has(model_path) && tokenizerCache.has(model_path)) {
        return { model: modelCache.get(model_path), tokenizer: tokenizerCache.get(model_path) };
    }

    const model = await AutoModelForCausalLM.from_pretrained(model_path);
    const tokenizer = await AutoTokenizer.from_pretrained(model_path);

    modelCache.set(model_path, model);
    tokenizerCache.set(model_path, tokenizer);

    await info.close();

    return { model, tokenizer };
}

async function getResponseFromLocalLLM(parameters, input) {
    const { model, tokenizer } = await getModelAndTokenizer(parameters.model_path);

    let prompt = parameters.preamble + '</s>' + input + '<s>';
    let { input_ids } = tokenizer(prompt);
    let info = new UnKennyInfo(`Generating ${parameters.actorName}'s response...`);
    await info.render(true);

    const localParameters = {
        min_new_tokens: parameters.minNewTokens,
        max_new_tokens: parameters.maxNewTokens,
        repetition_penalty: parameters.repetitionPenalty
    };
    let tokens = await model.generate(input_ids, localParameters);
    let response = tokenizer.decode(tokens[0], { skip_special_tokens: false });
    response = response.substring(prompt.length);

    await info.close();

    return response;
}

export { getResponseFromLocalLLM };

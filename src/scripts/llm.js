import { AutoModelForCausalLM, AutoTokenizer } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';

async function generateResponse(actor, input) {
    let model_path = await actor.getFlag("unkenny", "model");
    if (!model_path) {
        ui.notifications.error("Please select a model in the actor sheet.");
        return;
    }
    const model = await AutoModelForCausalLM.from_pretrained(model_path);
    const tokenizer = await AutoTokenizer.from_pretrained(model_path);
    
    let preamble = await actor.getFlag("unkenny", "preamble");
    let prompt = preamble + '</s>' + input + '<s>';
    let { input_ids } = tokenizer(prompt);

    let minNewTokens = await actor.getFlag("unkenny", "minNewTokens");
    let maxNewTokens = await actor.getFlag("unkenny", "maxNewTokens");
    let repetitionPenalty = await actor.getFlag("unkenny", "repetitionPenalty");
    let tokens = await model.generate(input_ids, { min_new_tokens: minNewTokens, max_new_tokens: maxNewTokens, repetition_penalty: repetitionPenalty });
    let response = tokenizer.decode(tokens[0], { skip_special_tokens: false });
    response = response.substring(prompt.length);

    let prefixWithTalk = await actor.getFlag("unkenny", "prefixWithTalk");
    if (prefixWithTalk) {
        response = "/talk " + response;
    }

    return response;
}

export { generateResponse };
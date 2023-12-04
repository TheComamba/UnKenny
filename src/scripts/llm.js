import { AutoModelForCausalLM, AutoTokenizer } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';
// There are not many options at the moment:
// https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&language=en&sort=trending
const model_path = 'Felladrin/onnx-bloomz-560m-sft-chat';
//const model_path = 'mkly/TinyStories-1M-ONNX';

async function generateResponse(actor, input) {
    const model = await AutoModelForCausalLM.from_pretrained(model_path);
    const tokenizer = await AutoTokenizer.from_pretrained(model_path);
    let preamble = await actor.getFlag("unkenny", "preamble");
    let prompt = preamble + '</s>' + input + '<s>';
    let { input_ids } = tokenizer(prompt);
    let tokens = await model.generate(input_ids, { min_new_tokens: 3, max_new_tokens: 128, repetition_penalty: 1.2});
    let response = tokenizer.decode(tokens[0], { skip_special_tokens: false });
    response = response.substring(prompt.length);
    return response;
}

export { generateResponse };
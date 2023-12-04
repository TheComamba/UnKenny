import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';
// There are not many options at the moment:
// https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js&language=en&sort=trending
const model = 'Felladrin/onnx-bloomz-560m-sft-chat';
//const model = 'mkly/TinyStories-1M-ONNX';

async function generateResponse(actor, input) {
    let response_generator = await pipeline('text-generation', model);
    let response = await response_generator(input);
    if (response.length === 0) {
        return "[Response is empty.]"
    }
    let response_text = response[0].generated_text;
    response_text = response_text.substring(input.length);
    return response_text;
}

export { generateResponse };
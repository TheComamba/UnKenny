import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';

async function generateResponse(actor, input) {
    let response_generator = await pipeline('text-generation');
    let response = await response_generator(input);
    if (response.length === 0) {
        return "[Response is empty.]"
    }
    let response_text = response[0].generated_text;
    response_text = response_text.substring(input.length);
    return response_text;
}

export { generateResponse };
import { expect } from 'chai';
import { getLocalModels, getModelToTextMap, getOpenAiModels, getTokenLimit, isLocal } from '../src/scripts/models.js';
import { loadExternalModule } from '../src/scripts/shared.js';

describe('getModelToTextMap', function () {
    it('should return a map of models to text', () => {
        const map = getModelToTextMap();
        expect(map).to.be.an('object');
        expect(Object.keys(map).length).to.be.greaterThan(0);
        for (const [key, value] of Object.entries(map)) {
            expect(key).to.be.a('string');
            expect(value).to.be.a('string');
        }
    });
});

describe('getLocalModels', function () {
    it('should return an array of local models', () => {
        const localModels = getLocalModels();
        expect(localModels).to.be.an('array');
        expect(localModels.length).to.be.greaterThan(0);
        for (const model of localModels) {
            expect(model).to.be.a('string');
            expect(isLocal(model)).to.be.true;
        }
    });
});

describe('getOpenAiModels', function () {
    it('should return an array of OpenAI models', () => {
        const openAiModels = getOpenAiModels();
        expect(openAiModels).to.be.an('array');
        expect(openAiModels.length).to.be.greaterThan(0);
        for (const model of openAiModels) {
            expect(model).to.be.a('string');
            expect(isLocal(model)).to.be.false;
        }
    });
});

describe('getTokenLimit', function () {
    it('should return a positive number for every model', () => {
        const map = getModelToTextMap();
        for (const [model, _value] of Object.entries(map)) {
            let limit = getTokenLimit(model);
            expect(limit).to.be.greaterThan(0);
        }
    });


    it('should return the verifiable number for local model', async () => {
        const transformersModule = await loadExternalModule('@xenova/transformers');
        const map = getModelToTextMap();
        for (const [model, _value] of Object.entries(map)) {
            if (!isLocal(model)) {
                continue;
            }
            const tokenizer = await transformersModule.AutoTokenizer.from_pretrained(model)
            let expected_limit = tokenizer.model_max_length;

            let limit = getTokenLimit(model);
            expect(limit).to.be.equal(expected_limit);
        }
    });
});

import { expect } from 'chai';
import { getLocalModels, getModelToTextMap, getOpenAiModels, getTokenLimit, isLocal } from '../src/scripts/models.js';
import { loadExternalModule } from '../src/scripts/shared.js';

describe('getModelToTextMap', () => {
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

describe('getLocalModels', () => {
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

describe('getOpenAiModels', () => {
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

describe('getTokenLimit', async () => {
    it('should return a positive number for every model', () => {
        const map = getModelToTextMap();
        for (const [model, _value] of Object.entries(map)) {
            let limit = getTokenLimit(model);
            expect(limit).to.be.greaterThan(0);
        }
    });

    const transformersModule = await loadExternalModule('@xenova/transformers', '2.17.1');

    it('should return the verifiable number for local model', () => {
        const map = getModelToTextMap();
        for (const [model, _value] of Object.entries(map)) {
            if (!isLocal(model)) {
                continue;
            }
            tokenizer = transformersModule.AutoTokenizer.from_pretrained(model)
            let expected_limit = tokenizer.model_max_length;

            let limit = getTokenLimit(model);
            expect(limit).to.be.equal(expected_limit);
        }
    });
});

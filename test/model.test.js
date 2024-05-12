import { expect } from 'chai';
import { getLocalModels, getModelToTextMap, getOpenAiModels, isLocal } from '../src/scripts/models.js';

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

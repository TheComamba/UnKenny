import { expect } from 'chai';
import { getModelToTextMap, getOpenAiModels, getTokenLimit } from '../src/scripts/models.js';
import { loadExternalModule } from '../src/scripts/shared.js';
import mockReset from '../__mocks__/main.js';

describe('getModelToTextMap', function () {
    this.beforeEach(() => {
        mockReset();
    });

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

describe('getOpenAiModels', function () {
    this.beforeEach(() => {
        mockReset();
    });

    it('should return an array of OpenAI models', () => {
        const openAiModels = getOpenAiModels();
        expect(openAiModels).to.be.an('array');
        expect(openAiModels.length).to.be.greaterThan(0);
        for (const model of openAiModels) {
            expect(model).to.be.a('string');
        }
    });
});

describe('getTokenLimit', function () {
    this.beforeEach(() => {
        mockReset();
    });

    it('should return a positive number for every model', () => {
        const map = getModelToTextMap();
        for (const [model, _value] of Object.entries(map)) {
            let limit = getTokenLimit(model);
            expect(limit).to.be.greaterThan(0);
        }
    });
});

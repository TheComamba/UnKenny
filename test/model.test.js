import { expect } from 'chai';
import { getModelsByType, getModelToTextMap } from '../src/scripts/models.js';
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

describe('getModelsByType', function () {
    this.beforeEach(() => {
        mockReset();
    });

    it('should return models by type', () => {
        const openaiModels = getModelsByType('openai');
        expect(openaiModels).to.be.an('array');
        expect(openaiModels.length).to.be.greaterThan(0);
        openaiModels.forEach(model => {
            expect(model).to.be.a('string');
        });

        const googleModels = getModelsByType('google');
        expect(googleModels).to.be.an('array');
        expect(googleModels.length).to.be.greaterThan(0);
        googleModels.forEach(model => {
            expect(model).to.be.a('string');
        });

        const customModels = getModelsByType('custom');
        expect(customModels).to.be.an('array');
        expect(customModels.length).to.be.greaterThan(0);
        customModels.forEach(model => {
            expect(model).to.be.a('string');
        });
    });
});

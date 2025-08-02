import { expect } from 'chai';
import { getModelToTextMap } from '../src/scripts/models.js';
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

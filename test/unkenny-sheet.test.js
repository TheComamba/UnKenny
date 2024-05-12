import { expect } from 'chai';
import { UnKennySheet } from "../src/apps/unkenny-sheet.js";
import fs from 'fs';
import Handlebars from 'handlebars';
import { getLocalModels } from '../src/scripts/models.js';

describe('UnKennySheet', () => {
    let actor;
    let sheet;

    beforeEach(() => {
        actor = new Actor();
        sheet = new UnKennySheet(actor);
    });

    if ('should have a template beginning with "modules/unkenny/"', () => {
        expect(sheet.template).to.include('modules/unkenny/');
    });

    it('should have a renderable template', () => {
        const templatePath = sheet.template.replace('modules/unkenny/', 'src/');
        const templateString = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateString);
        const output = template(actor);

        expect(output).to.include('submit');
    });

    it('should have a getData method that returns a filled context', async () => {
        const context = await sheet.getData();
        expect(Object.keys(context).length).to.be.greaterThan(0);
    });

    it('should not display data for a new actor', async () => {
        const context = await sheet.getData();
        expect(context.alias).to.be.empty;
        expect(context.preamble).to.be.empty;
        for (const model of context.models) {
            expect(model.isSelected).to.be.false;
        }
        expect(context.minNewTokens).to.be.undefined;
        expect(context.maxNewTokens).to.be.undefined;
        expect(context.repetitionPenalty).to.be.undefined;
        expect(context.temperature).to.be.undefined;
    });

    it('should display data for an existing actor', async () => {
        actor.setFlag("unkenny", "alias", "test alias");
        actor.setFlag("unkenny", "preamble", "test preamble");
        actor.setFlag("unkenny", "model", getLocalModels()[0]);
        actor.setFlag("unkenny", "minNewTokens", 1);
        actor.setFlag("unkenny", "maxNewTokens", 10);
        actor.setFlag("unkenny", "repetitionPenalty", 1.0);
        actor.setFlag("unkenny", "temperature", 0.5);

        const context = await sheet.getData();
        expect(context.alias).to.equal("test alias");
        expect(context.preamble).to.equal("test preamble");
        for (const model of context.models) {
            if (model.path == getLocalModels()[0]) {
                expect(model.isSelected).to.be.true;
            } else {
                expect(model.isSelected).to.be.false;
            }
        }
        expect(context.minNewTokens).to.equal(1);
        expect(context.maxNewTokens).to.equal(10);
        expect(context.repetitionPenalty).to.equal(1.0);
        expect(context.temperature).to.equal(0.5);
    });

    it('should set the context model when the model changes', async () => {
        const context = await sheet.getData();
        const model = getLocalModels()[0];
        const event = { target: { name: "model", value: model } };
        await sheet._onChangeInput(event);
        expect(context.models.find(m => m.isSelected).path).to.equal(model);
    });
});

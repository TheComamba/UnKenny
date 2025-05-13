import { expect } from 'chai';
import { UnKennySheet } from "../src/apps/unkenny-sheet.js";
import fs from 'fs';
import Handlebars from 'handlebars';
import { getOpenAiModels } from '../src/scripts/models.js';
import mockReset from '../__mocks__/main.js';

describe('UnKennySheet', function () {
    let actor;
    let sheet;

    beforeEach(() => {
        mockReset();
        actor = new Actor();
        sheet = new UnKennySheet(actor);
    });

    if ('should have a template beginning with "modules/unkenny/"', () => {
        expect(sheet.template).to.include('modules/unkenny/');
    });

    it('should have a renderable template', async () => {
        const templatePath = sheet.template.replace('modules/unkenny/', 'src/');
        const templateString = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateString);
        const context = await sheet.getData();
        const output = template(context);

        expect(output).to.include('submit');
    });

    it('should have a getData method that returns a filled context', async () => {
        const context = await sheet.getData();
        expect(Object.keys(context).length).to.be.greaterThan(0);
        expect(Object.keys(context.models).length).to.be.greaterThan(1);
    });

    it('should offer an empty model as first option', async () => {
        const context = await sheet.getData();
        expect(context.models[0].model).to.be.empty;
        expect(context.models[0].text).to.be.empty;
    });

    it('should not display data for a new actor', async () => {
        const context = await sheet.getData();
        expect(context.alias).to.be.empty;
        expect(context.preamble).to.be.empty;
        for (const model of context.models) {
            expect(model.isSelected).to.be.false;
        }
        expect(context.minNewTokens).to.be.null;
        expect(context.maxNewTokens).to.be.null;
        expect(context.repetitionPenalty).to.be.null;
        expect(context.temperature).to.be.null;
    });

    it('should display data for an existing actor', async () => {
        await actor.setFlag("unkenny", "alias", "test alias");
        await actor.setFlag("unkenny", "preamble", "test preamble");
        await actor.setFlag("unkenny", "model", getOpenAiModels()[0]);
        await actor.setFlag("unkenny", "minNewTokens", 1);
        await actor.setFlag("unkenny", "maxNewTokens", 10);
        await actor.setFlag("unkenny", "repetitionPenalty", 1.0);
        await actor.setFlag("unkenny", "temperature", 0.5);
        await actor.setFlag("unkenny", "prefix", "talk");

        const context = await sheet.getData();
        expect(context.alias).to.equal("test alias");
        expect(context.preamble).to.equal("test preamble");
        for (const model of context.models) {
            if (model.model == getOpenAiModels()[0]) {
                expect(model.isSelected).to.be.true;
            } else {
                expect(model.isSelected).to.be.false;
            }
        }
        expect(context.minNewTokens).to.equal(1);
        expect(context.maxNewTokens).to.equal(10);
        expect(context.repetitionPenalty).to.equal(1.0);
        expect(context.temperature).to.equal(0.5);
        for (const prefix of context.prefixes) {
            if (prefix.key == "talk") {
                expect(prefix.isSelected).to.be.true;
            } else {
                expect(prefix.isSelected).to.be.false;
            }
        }
    });

    it('should set the context model when the model changes', async () => {
        const oldModel = getOpenAiModels()[0];
        const newModel = getOpenAiModels()[1];
        await actor.setFlag("unkenny", "model", oldModel);
        const context = await sheet.getData();

        const event = { target: { name: "model", value: newModel } };
        await sheet._onChangeInput(event);

        for (const model of context.models) {
            if (model.model == newModel) {
                expect(model.isSelected).to.be.true;
            } else {
                expect(model.isSelected).to.be.false;
            }
        }
    });

    it('should update the actor flags when the form is submitted', async () => {
        const formData = {
            alias: "test alias",
            preamble: "test preamble",
            model: getOpenAiModels()[0],
            minNewTokens: 1,
            maxNewTokens: 10,
            repetitionPenalty: 1.0,
            temperature: 0.5,
            prefix: "talk"
        };

        await sheet._updateObject(null, formData);

        expect(await actor.getFlag("unkenny", "alias")).to.equal("test alias");
        expect(await actor.getFlag("unkenny", "preamble")).to.equal("test preamble");
        expect(await actor.getFlag("unkenny", "model")).to.equal(getOpenAiModels()[0]);
        expect(await actor.getFlag("unkenny", "minNewTokens")).to.equal(1);
        expect(await actor.getFlag("unkenny", "maxNewTokens")).to.equal(10);
        expect(await actor.getFlag("unkenny", "repetitionPenalty")).to.equal(1.0);
        expect(await actor.getFlag("unkenny", "temperature")).to.equal(0.5);
        expect(await actor.getFlag("unkenny", "prefix")).to.equal("talk");
    });

    it('should unset the actor flags when the form is emptied', async () => {
        const formData = {
            alias: "",
            preamble: "",
            model: "",
            minNewTokens: null,
            maxNewTokens: null,
            repetitionPenalty: null,
            temperature: null,
            prefix: "none"
        };

        await sheet._updateObject(null, formData);

        expect(await actor.getFlag("unkenny", "alias")).to.be.empty;
        expect(await actor.getFlag("unkenny", "preamble")).to.be.empty;
        expect(await actor.getFlag("unkenny", "model")).to.be.undefined;
        expect(await actor.getFlag("unkenny", "minNewTokens")).to.be.undefined;
        expect(await actor.getFlag("unkenny", "maxNewTokens")).to.be.undefined;
        expect(await actor.getFlag("unkenny", "repetitionPenalty")).to.be.undefined;
        expect(await actor.getFlag("unkenny", "temperature")).to.be.undefined;
        expect(await actor.getFlag("unkenny", "prefix")).to.be.undefined;
    });
});

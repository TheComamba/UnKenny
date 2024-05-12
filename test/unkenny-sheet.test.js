import { expect } from 'chai';
import { UnKennySheet } from "../src/apps/unkenny-sheet.js";
import fs from 'fs';
import Handlebars from 'handlebars';

describe('UnKennySheet', () => {
    let actor;
    let sheet;

    beforeEach(() => {
        actor = new Actor();
        sheet = new UnKennySheet(actor);
    });

    if('should have a template beginning with "modules/unkenny/"', () => {
        expect(sheet.template).to.include('modules/unkenny/');
    });

    it('should have a renderable template', () => {
        const templatePath = sheet.template.replace('modules/unkenny/', 'src/');
        const templateString = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateString);
        const output = template(actor);
        
        expect(output).to.include('submit');
    });
});

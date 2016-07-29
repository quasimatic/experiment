import dom from "../dom"
import findByName from '../../src/locators/name';

describe("Locator: Name Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in name", function() {
        dom.render(<input name="name" id="target"/>);
        findByName({label:"name", container:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find in name case insensitive", function() {
        dom.render(<input name="nAmE" id="target"/>);
        findByName({label:"naMe", container:document.body}).should.deep.equal([dom.get("target")]);
    });
});
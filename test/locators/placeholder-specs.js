import dom from "../dom"
import findByPlaceholder from '../../src/locators/placeholder';

describe("Locator: Placeholder Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in placeholder", function() {
        dom.render(<input placeholder="enter name" id="target"/>);
        findByPlaceholder("enter name", document).should.deep.equal([dom.get("target")]);
    });

    it("should find in placeholder case insensitive", function() {
        dom.render(<input placeholder="eNter namE" id="target"/>)
        findByPlaceholder("enteR naMe", document).should.deep.equal([dom.get("target")]);
    });
});
import dom from "../dom"
import findByPlaceholder from '../../src/locators/placeholder';

describe("Locator: Placeholder Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in placeholder", function() {
        var input = dom.create("input", "", {placeholder: "enter name"});
        findByPlaceholder("enter name", document).should.deep.equal([input]);
    });

    it("should find in placeholder case insensitive", function() {
        var input = dom.create("input", "", {PlacEholder: "eNter namE"});
        findByPlaceholder("enteR naMe", document).should.deep.equal([input]);
    });
});
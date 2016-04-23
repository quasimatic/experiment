import dom from "../dom"
import findByName from '../../src/locators/name';

describe("Locator: Name Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";

    });

    it("should find in name", function() {
        var input = dom.create("input", "", {name: "name"});
        findByName("name", document).should.deep.equal([input]);
    });

    it("should find in name case insensitive", function() {
        var input = dom.create("input", "", {NamE: "nAmE"});
        findByName("naMe", document).should.deep.equal([input]);
    });
});
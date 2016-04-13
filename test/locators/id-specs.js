import dom from "../dom"
import findByID from '../../src/locators/id';

describe("Locator: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by id", function() {
        var div = dom.createDiv("text", {id: "unique-id"});

        findByID("unique-id", document).should.deep.equal([div]);
    });

    it("should not find by id", function() {
        var div = dom.createDiv("text", {id: "unique-id"});

        findByID("missing-id", document).should.deep.equal([]);
    });
});
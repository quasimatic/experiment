import dom from "../dom"
import findByClassName from '../../src/locators/class-name';

describe("Locator: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by class name", function() {
        var div = dom.createDiv("text", {class: "class-name"});
        findByClassName("class-name", document).should.deep.equal([div]);
    });

    it("should not find by class name", function() {
        var div = dom.createDiv("text", {class: "class-name"});

        findByClassName("missing-class", document).should.deep.equal([]);
    });
});
import dom from "../dom"
import findByNodeType from '../../src/locators/node-type';

describe("Locator: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by node type", function() {
        var div = dom.create("div");

        findByNodeType("div", document).should.deep.equal([div]);
    });

    it("should not find by node type", function() {
        var div = dom.create("span");

        findByNodeType("div", document).should.deep.equal([]);
    });
});
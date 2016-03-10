import dom from "../dom"
import findExactText from '../../src/find-strategies/exact-text';

describe("Find strategy: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    })

    it("should find by exact text match", function() {
        var div = dom.createDiv("exact text");

        findExactText("exact text", document).should.deep.equal([div]);
    });

    it("should not find containing match", function() {
        dom.createDiv("not so exact text here");

        findExactText("exact text", document).should.deep.equal([]);
    });

    it("should find more than one", function() {
        var div = dom.createDiv("exact text");
        var div2 = dom.createDiv("exact text");

        findExactText("exact text", document).should.deep.equal([div, div2]);
    })
});
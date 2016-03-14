import dom from "../dom"
import findContainsText from '../../src/find-strategies/contains-text';

describe("Find strategy: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by exact text match", function() {
        var div = dom.createDiv("contains text");

        findContainsText("contains text", document).should.deep.equal([div]);
    });

    it("should find containing match", function() {
        var div = dom.createDiv("this contains text here");

        findContainsText("contains text", document).should.deep.equal([div]);
    });

    it("should find more than one", function() {
        var div = dom.createDiv("contains text");
        var div2 = dom.createDiv("this contains text here");

        findContainsText("contains text", document).should.deep.equal([div, div2]);
    });

    it("should not find missing text", function() {
        var div = dom.createDiv("contains text");

        findContainsText("missing text", document).should.deep.equal([]);
    })
});
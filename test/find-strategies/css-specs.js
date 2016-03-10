import dom from "../dom"
import findByCSS from '../../src/find-strategies/css';

describe("Find strategy: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    })

    it("should find by css selector", function() {
        var div = dom.createDiv("text", {class: "class-name"});

        findByCSS(".class-name", document).should.deep.equal([div]);
    });

    it("should not find by css selector", function() {
        var div = dom. createDiv("text", {class: "class-name"});

        findByCSS(".missing-class", document).should.deep.equal([]);
    });
});
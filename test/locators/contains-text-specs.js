import dom from "../dom"
import findContainsText from '../../src/locators/contains-text';

describe("Locator: Contains Match", function() {
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

    it("should find by case insensitive", function() {
        var div = dom.createDiv("conTainS teXt");

        findContainsText("Contains teXt", document).should.deep.equal([div]);
    })

    it("should find inside a textnode", function(){
        var div = dom.createDiv("");
        var text = dom.createText("text node", {parent: div});

        findContainsText("text node", document).should.deep.equal([div]);
    })

    it("should not search script tags", function() {
        var script = dom.create("script", "console.log('stuff')");

        findContainsText("stuff", document).should.deep.equal([]);
    })

    it("should not search noscript tags", function() {
        var script = dom.create("noscript", "console.log('stuff')");

        findContainsText("stuff", document).should.deep.equal([]);
    })

    it("should not search style tags", function() {
        var script = dom.create("style", "{ color: red; }");

        findContainsText("red", document).should.deep.equal([]);
    })
});
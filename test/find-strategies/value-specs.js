import dom from "../dom"
import findByValue from '../../src/find-strategies/value';

describe("Find strategy: Value Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in value", function() {
        var input = dom.create("input", "", {value: "enter name"});
        findByValue("enter name", document).should.deep.equal([input]);
    });

    it("should find in value case insensitive", function() {
        var input = dom.create("input", "", {vAlUe: "eNter namE"});
        findByValue("enteR naMe", document).should.deep.equal([input]);
    });

    it("should find by contains", function() {
        var input = dom.create("input", "", {});
        input.value = "this name is unique"
        findByValue("name", document).should.deep.equal([input]);
    });

    it("should find dynamically set value", function() {
        var input = dom.create("input", "", {});
        input.value = "name"
        findByValue("name", document).should.deep.equal([input]);
    });

    it("should find for button", function() {
        var element = dom.create("button", "", {});
        element.value = "name"
        findByValue("name", document).should.deep.equal([element]);
    });

    it("should find for option", function() {
        var element = dom.create("option", "", {});
        element.value = "name"
        findByValue("name", document).should.deep.equal([element]);
    });
    
    it("should find for param", function() {
        var element = dom.create("param", "", {});
        element.value = "name"
        findByValue("name", document).should.deep.equal([element]);
    });
});



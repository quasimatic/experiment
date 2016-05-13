import dom from "../dom"
import findByValue from '../../src/locators/value';

describe("Locator: Value Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in value", function() {
        dom.render(<input value="enter name" id="target"/>);
        findByValue("enter name", document).should.deep.equal([dom.get("target")]);
    });

    it("should find in value case insensitive", function() {
        dom.render(<input value="eNter namE" id="target"/>);
        findByValue("enteR naMe", document).should.deep.equal([dom.get("target")]);
    });

    it("should find by contains", function() {
        dom.render(<input id="target" value="this name is unique"/>);
        findByValue("name", document).should.deep.equal([dom.get("target")]);
    });

    it("should find dynamically set value", function() {
        dom.render(<input id="target"/>);
        dom.get("target").value = "name";
        findByValue("name", document).should.deep.equal([dom.get("target")]);
    });

    it("should find for button", function() {
        dom.render(<button value="name" id="target"></button>);
        findByValue("name", document).should.deep.equal([dom.get("target")]);
    });

    it("should find for option", function() {
        dom.render(<option value="name" id="target"></option>);
        findByValue("name", document).should.deep.equal([dom.get("target")]);
    });
    
    it("should find for param", function() {
        dom.render(<param value="name" id="target"/>);
        findByValue("name", document).should.deep.equal([dom.get("target")]);
    });
});



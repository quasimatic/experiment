import dom from "../dom"
import extension from '../../src/extensions/locators/value';

describe("Locator: Value Match", function() {
    let findByValue = extension.options["value"].locate;

    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in value", function() {
        dom.render(<input value="enter name" id="target"/>);
        findByValue({label:"enter name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find in value case insensitive", function() {
        dom.render(<input value="eNter namE" id="target"/>);
        findByValue({label:"enteR naMe", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find by contains", function() {
        dom.render(<input id="target" value="this name is unique"/>);
        findByValue({label:"name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find dynamically set value", function() {
        dom.render(<input id="target"/>);
        dom.get("target").value = "name";
        findByValue({label:"name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find for button", function() {
        dom.render(<button value="name" id="target"></button>);
        findByValue({label:"name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find for option", function() {
        dom.render(<option value="name" id="target"></option>);
        findByValue({label:"name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });
    
    it("should find for param", function() {
        dom.render(<param value="name" id="target"/>);
        findByValue({label:"name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });
});



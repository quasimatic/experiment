import dom from "../dom"
import extension from '../../src/extensions/search-in-type';

describe("Locator: type attribute", function() {
    let findByType = extension.properties.searchintype.locate;
    
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in type attribute", function() {
        dom.render(<input type="checkbox" id="target"/>)

        findByType({label:"checkbox", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find in type attribute case insensitive", function() {
        dom.render(<input type="checkbox" id="target"/>)
        findByType({label:"ChecKBoX", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should not find as contains in checkbox attribute", function() {
        dom.render(<input type="checkbox" id="target"/>)
        findByType({label:"check", scopeElement:document.body}).should.deep.equal([]);
    });
});
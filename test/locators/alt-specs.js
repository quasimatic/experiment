import dom from "../dom"
import extension from '../../src/extensions/search-in-alt';

describe("Locator: Image Match", function() {
    let findByAlt = extension.properties.searchinalt.locate;
    
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in alt attribute", function() {
        dom.render(<img alt="image-name" id="target"/>)

        findByAlt({label:"image-name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find in alt attribute case insensitive", function() {
        dom.render(<img alt="image-name" id="target"/>)
        findByAlt({label:"ImagE-nAme", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find as contains in alt attribute", function() {
        dom.render(<img alt="image-name" id="target"/>)
        findByAlt({label:"image-", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });
});
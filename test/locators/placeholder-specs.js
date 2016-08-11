import dom from "../dom"
import extension from '../../src/extensions/search-in-placeholder';

describe("Locator: Placeholder Match", function() {
    let findByPlaceholder = extension.properties.searchinplaceholder.locate;

    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in placeholder", function() {
        dom.render(<input placeholder="enter name" id="target"/>);
        findByPlaceholder({label:"enter name", scopeElement:document}).should.deep.equal([dom.get("target")]);
    });

    it("should find in placeholder case insensitive", function() {
        dom.render(<input placeholder="eNter namE" id="target"/>)
        findByPlaceholder({label:"enteR naMe", scopeElement:document}).should.deep.equal([dom.get("target")]);
    });
});
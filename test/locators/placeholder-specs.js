import dom from "../dom"
import extension from '../../src/extensions/placeholder';

describe("Locator: Placeholder Match", function() {
    let findByPlaceholder = extension.properties.placeholder.locate;

    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in placeholder", function() {
        dom.render(<input placeholder="enter name" id="target"/>);
        findByPlaceholder({label:"enter name", container:document}).should.deep.equal([dom.get("target")]);
    });

    it("should find in placeholder case insensitive", function() {
        dom.render(<input placeholder="eNter namE" id="target"/>)
        findByPlaceholder({label:"enteR naMe", container:document}).should.deep.equal([dom.get("target")]);
    });
});
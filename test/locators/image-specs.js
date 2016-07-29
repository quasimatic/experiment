import dom from "../dom"
import findByPlaceholder from '../../src/locators/image';

describe("Locator: Image Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in alt attribute", function() {
        dom.render(<img alt="image-name" id="target"/>)

        findByPlaceholder({label:"image-name", container:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find in alt attribute case insensitive", function() {
        dom.render(<img alt="image-name" id="target"/>)
        findByPlaceholder({label:"ImagE-nAme", container:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find as contains in alt attribute", function() {
        dom.render(<img alt="image-name" id="target"/>)
        findByPlaceholder({label:"image-", container:document.body}).should.deep.equal([dom.get("target")]);
    });
});
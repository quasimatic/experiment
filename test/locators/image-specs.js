import dom from "../dom"
import findByPlaceholder from '../../src/locators/image';

describe("Locator: Image Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in alt attribute", function() {
        dom.render(<img alt="image-name" id="target"/>)

        findByPlaceholder("image-name", document).should.deep.equal([dom.get("target")]);
    });

    it("should find in alt attribute case insensitive", function() {
        dom.render(<img alt="image-name" id="target"/>)
        findByPlaceholder("ImagE-nAme", document).should.deep.equal([dom.get("target")]);
    });

    it("should find as contains in alt attribute", function() {
        dom.render(<img alt="image-name" id="target"/>)
        findByPlaceholder("image-", document).should.deep.equal([dom.get("target")]);
    });
});
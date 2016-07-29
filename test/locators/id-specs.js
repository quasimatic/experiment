import dom from "../dom"
import findByID from '../../src/locators/id';

describe("Locator: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by id", function() {
        dom.render(<div id="unique-id">text</div>);

        findByID({label:"unique-id", container:document.body}).should.deep.equal([dom.get("unique-id")]);
    });

    it("should not find by id", function() {
        dom.render(<div id="unique-id"></div>)

        findByID({label:"missing-id", container:document.body}).should.deep.equal([]);
    });
});
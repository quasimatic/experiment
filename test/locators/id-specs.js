import dom from "../dom"
import findByID from '../../src/locators/id';

describe("Locator: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by id", function() {
        dom.render(<div id="unique-id">text</div>);

        findByID("unique-id", document).should.deep.equal([dom.get("unique-id")]);
    });

    it("should not find by id", function() {
        dom.render(<div id="unique-id"></div>)

        findByID("missing-id", document).should.deep.equal([]);
    });
});
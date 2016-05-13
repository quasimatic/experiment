import dom from "../dom"
import findByClassName from '../../src/locators/class-name';

describe("Locator: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by class name", function() {
        dom.render(<div className="class-name" id="target">text</div>);

        findByClassName("class-name", document).should.deep.equal([dom.get("target")]);
    });

    it("should not find by class name", function() {
        dom.render(<div className="class-name">text</div>);

        findByClassName("missing-class", document).should.deep.equal([]);
    });
});
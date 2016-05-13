import dom from "../dom"
import findByNodeType from '../../src/locators/node-type';

describe("Locator: Exact Match", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find by node type", function () {
        dom.render(<div id="target"></div>);

        findByNodeType("div", document).should.deep.equal([dom.get("target")]);
    });

    it("should not find by node type", function () {
        dom.render(<span></span>);
        
        findByNodeType("div", document).should.deep.equal([]);
    });
});
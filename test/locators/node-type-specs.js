import dom from "../dom"
import findByNodeType from '../../src/locators/node-type';

describe("Locator: Exact Match", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find by node type", function () {
        dom.render(<p id="target"></p>);

        findByNodeType("p", document).should.deep.equal([dom.get("target")]);
    });

    it("should not find by node type", function () {
        dom.render(<span></span>);
        
        findByNodeType("p", document).should.deep.equal([]);
    });
});
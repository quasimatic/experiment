import dom from "../dom"
import extension from '../../src/extensions/search-as-nodetype';

describe("Locator: Exact Match", function () {
    let findByNodeType = extension.properties.searchasnodetype.locate;
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find by node type", function () {
        dom.render(<p id="target"></p>);

        findByNodeType({label: "p", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should not find by node type", function () {
        dom.render(<span></span>);
        
        findByNodeType({label: "p", scopeElement:document.body}).should.deep.equal([]);
    });
});
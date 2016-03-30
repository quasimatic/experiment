import defaultFinder from "../../src/find-strategies/default";
import DiscoverParentContainer from '../../src/scope-strategies/discover-parent';
import parser from "../../src/parser";
import dom from "../dom";

var scopeStrategy;

describe("Scope strategy: Discover container", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
        scopeStrategy = new DiscoverParentContainer(defaultFinder);
    });

    it("should find within a container", function () {
        dom.render(
            <div className="parent">
                <div id="target">child</div>
            </div>
        )

        scopeStrategy.search(parser.parse("parent>child"), document).should.deep.equal([dom.get('target')]);
    });

    it("should find next to", function () {
        dom.render(
            <div className="parent">
                <div>sibling 1</div>
                <div id="target">sibling 2</div>
            </div>
        )

        scopeStrategy.search(parser.parse("sibling 1>sibling 2"), document).should.deep.equal([dom.get('target')]);
    });

    it("should find all children within a container", function () {
        dom.render(
            <div className="parent">
                <div id="target-1">child</div>
                <div id="target-2">another one</div>
            </div>
        )

        scopeStrategy.search(parser.parse("parent>div"), document).should.deep.equal(dom.get('target-1', 'target-2'));
    });
});
import dom from "../dom"
import defaultFinder from "../../src/find-strategies/default";
import DiscoverParentContainer from '../../src/container-strategies/discover-parent';
import parser from "../../src/parser"

var containerSearcher;

describe("Container strategy: Discover Parent", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
        containerSearcher = new DiscoverParentContainer(defaultFinder);
    });

    it("should find within a container", function() {
        var divParent = dom.create("div", "", {class: "parent"})
        var divChild = dom.create("div", "child", { parent: divParent});
        var divChild2 = dom.create("div", "another one", { parent: divParent});

        containerSearcher.search(parser.parse("parent>child").containers, document).should.deep.equal([divChild]);
    });

    it("should find next to", function() {
        var divParent = dom.create("div", "", {class: "parent"})
        var divChild = dom.create("div", "sibling 1", { parent: divParent});
        var divChild2 = dom.create("div", "sibling 2", { parent: divParent});

        containerSearcher.search(parser.parse("sibling 1>sibling 2").containers, document).should.deep.equal([divChild2]);
    });

    it("should find all children within a container", function() {
        var divParent = dom.create("div", "", {class: "parent"})
        var divChild = dom.create("div", "child", { parent: divParent});
        var divChild2 = dom.create("div", "another one", { parent: divParent});

        containerSearcher.search(parser.parse("parent>div").containers, document).should.deep.equal([divChild, divChild2]);
    });
});
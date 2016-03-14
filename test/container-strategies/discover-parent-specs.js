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
});
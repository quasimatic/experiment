import defaultFinder from "../../src/find-strategies/default";
import DiscoverParentContainer from '../../src/container-strategies/discover-parent';
import parser from "../../src/parser"

var containerSearcher;

// describe("Scope strategy: Discover container", function() {
//     beforeEach(function(){
//         document.body.innerHTML = "";
//         containerSearcher = new DiscoverParentContainer(defaultFinder);
//     });
//
//     it("should find within a container", function() {
//         let child;
//         $('<div class="parent">').appendTo(document.body).append(
//             child = $('<div>child</div>')[0]
//         )
//
//         containerSearcher.search(parser.parse("parent>child"), document).should.deep.equal([child]);
//     });
//
//     it("should find next to", function() {
//         let child2;
//
//         $('<div class="parent">').appendTo(document.body).append(
//             '<div>sibling 1</div>',
//             child2 = $('<div>sibling 2</div>')[0]
//         )
//
//         containerSearcher.search(parser.parse("sibling 1>sibling 2"), document).should.deep.equal([child2]);
//     });
//
//     it("should find all children within a container", function() {
//         let child1, child2;
//         $('<div class="parent">').appendTo(document.body).append(
//             child1 = $('<div>child</div>')[0],
//             child2 = $('<div>another one</div>')[0]
//         )
//
//         containerSearcher.search(parser.parse("parent>div"), document).should.deep.equal([child1, child2]);
//     });
// });
// import glance from '../src/selector';
// import dom from "./dom"
//
// // TODO preload scope
// // it should fail on a bad preload selector
//
// describe("Preloading", function () {
//     beforeEach(function () {
//         document.body.innerHTML = "";
//     });
//
//     it('should preload only a label', function () {
//         dom.render(
//             <div>
//                 <div id="target">item</div>
//             </div>
//         );
//
//         glance("item", {
//             preload: {
//                 selector: "item",
//                 located: [dom.get("target")]
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
//
//     it('should preload a scope', function () {
//         dom.render(
//             <div id="scope">
//                 <div id="target">item</div>
//             </div>
//         );
//
//         glance("scope > item", {
//             preload: {
//                 selector: "scope",
//                 elements: [dom.get("scope")]
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
//
//     it("should preload multiple scopes", function () {
//         dom.render(
//             <div id="scope-1">
//                 <div id="scope-2">
//                     <div id="target">item</div>
//                 </div>
//             </div>
//         );
//
//         glance("scope-1 > scope-2 > item", {
//             preload: {
//                 selector: "scope-1 > scope-2",
//                 elements: [dom.get("scope-2")]
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
//
//     it("should preload multi level scopes and label", function () {
//         dom.render(
//             <div id="scope-1">
//                 <div id="scope-2">
//                     <div id="target">item</div>
//                 </div>
//             </div>
//         );
//
//         glance("scope-1 > scope-2 > item", {
//             preload: {
//                 selector: "scope-1 > scope-2 > item",
//                 elements: [dom.get("target")]
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
//
//     it("should preload multiple scopes and label", function () {
//         dom.render(
//             <div>
//                 <div class="scope" id="scope-1">
//                     <div id="target-1">item</div>
//                 </div>
//                 <div class="scope" id="scope-2">
//                     <div id="target-2">item</div>
//                 </div>
//             </div>
//         );
//
//         glance("scope > item", {
//             preload: {
//                 selector: "scope",
//                 elements: [dom.get("scope-1"), dom.get("scope-2")]
//             }
//         }).should.deep.equal(dom.get("target-1", "target-2"));
//     });
//
//     it("should preload an indexer", function () {
//         dom.render(
//             <div>
//                 <div>item 1</div>
//                 <div id="target">item 2</div>
//             </div>
//         );
//
//         glance("item#2", {
//             preload: {
//                 selector: "item#2",
//                 elements: [dom.get("target")]
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
//
//     it("should preload a label before an indexer", function () {
//         dom.render(
//             <div>
//                 <div id="item-1">item 1</div>
//                 <div id="target">item 2</div>
//             </div>
//         );
//
//         glance("item#2", {
//             preload: {
//                 selector: "item",
//                 elements: dom.get("item-1", "target")
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
//
//     it("should preload a label with a property", function () {
//         dom.render(
//             <div>
//                 <div>item 1</div>
//                 <div id="target">item 2</div>
//                 <div>item 3</div>
//             </div>
//         );
//
//         glance("item:even", {
//             preload: {
//                 selector: "item:even",
//                 elements: [dom.get("target")]
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
//
//     it("should preload a label before a property", function () {
//         dom.render(
//             <div>
//                 <div id="item-1">item 1</div>
//                 <div id="target">item 2</div>
//                 <div id="item-3">item 3</div>
//             </div>
//         );
//
//         glance.addExtension({
//             properties: {
//                 "even": {
//                     filter: function (elements) {
//                         return [elements[1]];
//                     }
//                 }
//             }
//         });
//
//         glance("item:even", {
//             preload: {
//                 selector: "item",
//                 elements: dom.get("item-1", "target", "item-3")
//             }
//         }).should.deep.equal(dom.get("target"));
//     });
// });
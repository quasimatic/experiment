import dom from '../dom'
import extension from '../../src/extensions/index';

describe("Locator: Search in attributes", function () {
    let filter = extension.filter;

    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should return all items if no position supplied", function () {
        dom.render(<div>
            <div id="target-1">item</div>
            <div id="target-2">item</div>
            <div id="target-3">item</div>
        </div>);

        filter({
            elements: dom.get("target-1", "target-2", "target-3"),
            target: {properties: []}
        }).should.deep.equal(dom.get("target-1", "target-2", "target-3"));
    });

    it("should return a single item for the specified index", function () {
        dom.render(<div>
            <div id="item-1">item</div>
            <div id="target">item</div>
            <div id="item-3">item</div>
        </div>);

        filter({
            elements: dom.get("item-1", "target", "item-3"),
            target: {properties: [2]}
        }).should.deep.equal([dom.get("target")]);
    });

    it("should start at one", function () {
        dom.render(<div>
            <div id="target">item</div>
            <div id="item-2">item</div>
            <div id="item-3">item</div>
        </div>);

        filter({
            elements: dom.get("target", "item-2", "item-3"),
            target: {properties: [1]}
        }).should.deep.equal([dom.get("target")]);
    });
});
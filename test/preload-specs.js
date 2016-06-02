import glance from '../src/selector';
import dom from "./dom"

describe("Preloading", function() {
    beforeEach(function() {
        document.body.innerHTML = "";
    });

    it('should preload only a label', function() {
        dom.render(
            <div>
                <div id="target">item</div>
            </div>
        );

        glance("item", {
            preload: {
                selector: "item",
                elements: [dom.get("target")]
            }
        }).should.deep.equal(dom.get("target"));
    });

    it('should preload a scope', function() {
        dom.render(
            <div id="scope">
                <div id="target">item</div>
            </div>
        );

        glance("scope > item", {
            preload: {
                selector: "scope",
                elements: [dom.get("scope")]
            }
        }).should.deep.equal(dom.get("target"));
    });

    it("should preload multiple scopes", function() {
        dom.render(
            <div id="scope-1">
                <div id="scope-2">
                    <div id="target">item</div>
                </div>
            </div>
        );

        glance("scope-1 > scope-2 > item", {
            preload: {
                selector: "scope-1 > scope-2",
                elements: [dom.get("scope-2")]
            }
        }).should.deep.equal(dom.get("target"));
    });

    it("should preload multiple scopes and label", function() {
        dom.render(
            <div id="scope-1">
                <div id="scope-2">
                    <div id="target">item</div>
                </div>
            </div>
        );

        glance("scope-1 > scope-2 > item", {
            preload: {
                selector: "scope-1 > scope-2 > item",
                elements: [dom.get("target")]
            }
        }).should.deep.equal(dom.get("target"));
    });

    // it should fail on a bad preload selector
});
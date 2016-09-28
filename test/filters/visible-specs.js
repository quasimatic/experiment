import glance from '../../src/selector';
import dom from "../dom"

describe("Filter: Visible", function () {
    this.timeout(10000)
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should filter out non visible items", function () {
        dom.render(
            <div>
                <div id="target">item</div>
                <div style={{display: "none"}}>item</div>
            </div>
        );

        return glance("item").should.deep.equal(dom.get("target"));
    });

    it("should find fixed position items", function () {
        dom.render(
            <div>
                <div id="target" style={{position: "fixed"}}>item</div>
                <div style={{display: "none"}}>item</div>
            </div>
        );

        return glance("item").should.deep.equal(dom.get("target"));
    });

    it("should find for text nodes", function () {
        dom.render(
            <div>
                <div id="target" style={{position: "fixed"}}>item</div>
                <div style={{display: "none"}}>item</div>
            </div>
        );

        return glance("item").should.deep.equal(dom.get("target"));
    });
});
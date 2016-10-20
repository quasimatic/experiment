import glance from '../../src/selector';
import dom from "../dom"

describe("Filter: Target is leaf node", function () {
    this.timeout(10000)
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should filter out non leaf nodes", function () {
        dom.render(
            <div>
                <div>
                    <div id="target">item</div>
                </div>
                <div className="item">
                    <div>something else</div>
                </div>
            </div>
        );

        return glance("item").should.deep.equal(dom.get("target"));
    });

    it("should return container nodes if no leaf nodes in set", function () {
        dom.render(
            <div>
                <div id="target" className="item">
                    <div>something else</div>
                </div>
            </div>
        );

        return glance("item").should.deep.equal(dom.get("target"));
    });

});
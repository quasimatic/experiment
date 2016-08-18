import glance from '../../src/selector';
import dom from "../dom"

describe("Shortest scope and container path", function () {
    this.timeout(10000)
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should get all items if the scope distances to their container are the same", function () {
        dom.render(
            <div>
                <div>
                    <div>scope</div>
                    <div id="target-1">item</div>
                </div>

                <div>
                    <div>scope</div>
                    <div>
                        <div>
                            <div id="target-2">item</div>
                        </div>
                    </div>
                </div>
            </div>
        );

        return glance("scope > item").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should get the items to the scope that has a shorter distance to the container", function () {
        dom.render(
            <div>
                <div>
                    <div>scope</div>
                    <div id="target">item</div>
                </div>

                <div>
                    <div>
                        <div>scope</div>
                    </div>
                    <div>
                        <div>
                            <div>item</div>
                        </div>
                    </div>
                </div>
            </div>
        );

        return glance("scope > item").should.deep.equal(dom.get("target"));
    });

    it("should get multiple elements of the same shortest distant", function () {
        dom.render(
            <div>
                <div>
                    <div>scope</div>
                    <div id="target-1">item A</div>
                </div>

                <div>
                    <div>scope</div>
                    <div id="target-2">item A</div>
                </div>
            </div>
        );

        return glance("scope > item A").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should return the item that is the scope", function () {
        dom.render(
            <div>
                <div>
                    <div id="target" className="item-class">item</div>
                </div>

                <div>
                    <div className="item-class"></div>
                    <div>
                        <div>item</div>
                    </div>
                </div>
            </div>
        );

        return glance("item-class > item").should.deep.equal(dom.get("target"));
    });

    it("should get all children", function () {
        dom.render(
            <div className="item-class">
                <div id="target-1">item</div>
                <div>
                    <div>
                        <div id="target-2">item</div>
                    </div>
                </div>
            </div>
        );

        return glance("item-class > item").should.deep.equal(dom.get("target-1", "target-2"));
    });


    it("should get child items instead of cousins", function () {
        dom.render(
            <div>
                <div className="item-class">
                    <div>
                        <div>
                            <div id="target">item</div>
                        </div>
                    </div>
                </div>
                <div>item</div>
            </div>
        );

        return glance("item-class > item").should.deep.equal(dom.get("target"));
    });
});
import glance from '../src/selector';
import dom from "./dom"

describe("Glance", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should look by exact text match", function () {
        dom.render(<div id="target">Content Item</div>)
        return glance("Content Item").should.deep.equal(dom.get("target"));
    });

    it("should look by content as contains", function () {
        dom.render(<div id="target">Item Contains stuff</div>)
        return glance("Item Contains").should.deep.equal(dom.get("target"));
    });

    it('will look by id', function () {
        dom.render(<div id="label-id"></div>);
        return glance("label-id").should.deep.equal(dom.get('label-id'))
    });

    it("should look by class", function () {
        dom.render(<div id="target" className="div-class"></div>)
        return glance("div-class").should.deep.equal(dom.get("target"));
    });

    it("should look by node type", function () {
        dom.render(<button id="target"></button>)
        return glance("button").should.deep.equal(dom.get("target"))
    });

    it("should support an indexer", function () {
        dom.render(
            <div>
                <div>foo</div>
                <div id="target">foo</div>
            </div>
        )
        return glance("foo#2").should.deep.equal(dom.get("target"))
    });

    it("should support a parent indexer", function () {
        dom.render(
            <div>
                <h2>
                    <div>Shared Title</div>
                </h2>
                <h2>
                    <div id="target">Shared Title</div>
                </h2>
            </div>
        )
        return glance("h2#2>Shared Title").should.deep.equal(dom.get("target"));
    });

    it("should look for text in a node that contains text and a node", function () {
        dom.render(
            <div id="target">
                text and nodes
                <div>this is something</div>
            </div>
        )

        return glance("text and nodes").should.deep.equal(dom.get("target"))
    });

    it("should get duplicates", function () {
        dom.render(
            <div>
                <div id="target-1">Duplicate</div>
                <div id="target-2">Duplicate</div>
            </div>
        )
        return glance("Duplicate").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should get duplicates for first type of match", function () {
        dom.render(
            <div>
                <div className="item"></div>
                <div className="item"></div>
                <div id="target-1">item</div>
                <div id="target-2">this is an item</div>
            </div>
        );

        return glance("item").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should show an error if element not found", function () {
        return glance("item-not-found").should.deep.equal([]);
    });

    it("should look by custom labels", function () {
        dom.render(
            <div className="random">
                <div>one</div>
                <div id="target-1">two</div>
            </div>
        );

        glance.addCustomLabels({
            "customlabel": function (g, selector) {
                return g("random>div#2");
            }
        });

        glance("customlabel").should.deep.equal(dom.get("target-1"));
    });

    it("should only search visible elements", function () {
        dom.render(
            <div>
                <div id="target-1">Duplicate</div>
                <div style={{display: "none"}}>Duplicate</div>
            </div>
        )

        return glance("Duplicate").should.deep.equal(dom.get("target-1"));
    })

    it("should limit to next sibling", function () {
        dom.render(
            <div>
                <div>
                    <label>label</label>
                    <input id="target-1"/>
                    <label>another</label>
                    <input />
                </div>
                <div>
                    <label>label</label>
                    <input id="target-2"/>
                    <label >another</label>
                    <input />
                </div>
            </div>
        )

        return glance("label>input").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should find text in select option", function () {
        dom.render(
            <div>
                <select id="select-1">
                    <option value="value1" id="target-1">text1</option>
                    <option value="value2">text2</option>
                </select>
            </div>
        )

        return glance("select-1>text1").should.deep.equal(dom.get("target-1"));
    })
});

describe('Selector Nth', function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should get the nth item", function() {
        dom.render(
            <div className="box1">
                <div className="item-1">Item A</div>
                <div id="target" className="item-2">Item A</div>
                <div className="item-3">Item A</div>
            </div>
        )

        return glance("box1>Item A#2").should.deep.equal(dom.get("target"));
    });

    it("should get the nth container for an item", function() {
        dom.render(
            <div className="box2">
                <div className="inner-box">
                    <div className="item-1">Item A</div>
                </div>
                <div className="inner-box">
                    <div id="target" className="item-2">Item A</div>
                </div>
                <div className="inner-box">
                    <div className="item-3">Item A</div>
                </div>
            </div>
        )

        return glance("box2>inner-box#2>Item A").should.deep.equal(dom.get("target"));
    });
});
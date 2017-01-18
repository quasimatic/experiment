import glance from '../src/selector';
import dom from "./dom"

describe("Glance", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it('should find nothing with an empty selector', function () {
        try {
            glance();
            throw new Error("Didn't throw error");
        }
        catch (err) {
            err.message.should.equal("Selector required");
        }
    });

    it("should look by exact text match", function (done) {
        dom.render(<div id="target">Content Item</div>);
        glance("Content Item", function (err, result) {
            result.should.deep.equal(dom.get("target"));
            done();
            return result;
        }).should.deep.equal(dom.get("target"));
    });

    it("should look by content as contains", function () {
        dom.render(<div id="target">Item Contains stuff</div>);
        return glance("Item Contains").should.deep.equal(dom.get("target"));
    });

    it('will look by id', function () {
        dom.render(<div id="label-id"></div>);
        return glance("label-id").should.deep.equal(dom.get('label-id'));
    });

    it("should look by class", function () {
        dom.render(<div id="target" className="div-class"></div>);
        return glance("div-class").should.deep.equal(dom.get("target"));
    });

    it("should look by node type", function () {
        dom.render(<button id="target"></button>);
        return glance("button").should.deep.equal(dom.get("target"));
    });

    it("should support an indexer", function () {
        dom.render(
            <div>
                <div>foo</div>
                <div id="target">foo</div>
            </div>
        );
        return glance("foo#2").should.deep.equal(dom.get("target"));
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
        );
        return glance("h2#2>Shared Title").should.deep.equal(dom.get("target"));
    });

    it("should look for text in a node that contains text and a node", function () {
        dom.render(
            <div id="target">
                text and nodes
                <div>this is something</div>
            </div>
        );

        return glance("text and nodes").should.deep.equal(dom.get("target"));
    });

    it("should get duplicates", function () {
        dom.render(
            <div>
                <div id="target-1">Duplicate</div>
                <div id="target-2">Duplicate</div>
            </div>
        );
        return glance("Duplicate").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should get duplicates for visible items only", function () {

        dom.render(
            <div>
                <div id="target-1">item</div>
                <div id="target-2" className="item"></div>
                <div className="item" style={{display: "none"}}></div>
                <div style={{display: "none"}}>this is an item</div>
            </div>
        );

        return glance("item").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should return an empty array if no elements are found", function () {
        return glance("item-not-found").should.deep.equal([]);
    });

    it("should look by custom labels", function () {
        dom.render(
            <div className="random">
                <div>one</div>
                <div id="target-1">two</div>
            </div>
        );

        glance.addExtension({
            labels: {
                "customlabel": {
                    locate: function ({glance}, resultHandler) {
                        return resultHandler(null, glance("random>div#2"));
                    }
                }
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
        );

        return glance("Duplicate").should.deep.equal(dom.get("target-1"));
    });

    it("should find text in select option", function () {
        dom.render(
            <div>
                <select id="select-1">
                    <option value="value1" id="target-1">text1</option>
                    <option value="value2">text2</option>
                </select>
            </div>
        );

        return glance("select-1>text1").should.deep.equal(dom.get("target-1"));
    });

    it("should not return the item that is the scope", function () {
        dom.render(
            <div>
                <div>
                    <div id="item-1" className="item-class">item</div>
                </div>

                <div>
                    <div id="item-2" className="item-class"></div>
                    <div>
                        <div id="target">item</div>
                    </div>
                </div>
            </div>
        );

        return glance("item-class > item").should.deep.equal(dom.get("target"));
    });
});

describe('Selector filter', function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find within specified attribute value", function () {
        dom.render(
            <div id="target" data-key="random"></div>
        );

        return glance("random#attribute-data-key").should.deep.equal(dom.get("target"));
    });

    it("should apply default filters before an index filter if index filter is first", function () {
        dom.render(
            <div>
                <div style={{display: 'none'}}>item 1</div>
                <div>item 2</div>
                <div id="target">item 3</div>
            </div>
        );

        return glance("item#2").should.deep.equal(dom.get("target"));
    });
});

describe('Selector Nth', function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should get the nth item", function () {
        dom.render(
            <div className="box1">
                <div className="item-1">Item A</div>
                <div id="target" className="item-2">Item A</div>
                <div className="item-3">Item A</div>
            </div>
        );

        return glance("box1>Item A#2").should.deep.equal(dom.get("target"));
    });

    it("should get the nth scope for an item", function () {
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
        );

        return glance("box2>inner-box#2>Item A").should.deep.equal(dom.get("target"));
    });

    it("should get the nth item with multiple scopes", function () {
        dom.render(
            <div>
                <div>Item A</div>
                <div id="target">Item B</div>
                <div>Item B</div>
                <div>Item A</div>
            </div>
        );

        return glance("Item A > Item B#1").should.deep.equal(dom.get("target"));
    });

    // it("should get the nth item with multiple scopes and option", function () {
    //     dom.render(
    //         <div>
    //             <div>Item A</div>
    //             <div id="target">Item B</div>
    //             <div>Item B</div>
    //             <div>Item A</div>
    //         </div>
    //     );
    //
    //     glance.addExtension({
    //         options: {
    //             "custom-mod": function ({elements}, resultHandler) {
    //                 return resultHandler(null, [elements[0]]);
    //             }
    //         }
    //     })
    //
    //     return glance("Item A > Item B:custom-mod").should.deep.equal(dom.get("target"));
    // });
});

describe('Selector should apply option', function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should filter items for option", function () {
        dom.render(
            <div>
                <div id="target-1">1</div>
                <div id="target-2">12</div>
                <div>123</div>
                <div>1234</div>
            </div>
        );

        glance.addExtension({
            options: {
                "lessthan3characters": function ({elements}, resultHandler) {
                    return resultHandler(null, elements.filter(e => e.innerHTML.length < 3));
                }
            }
        });

        return glance("1#lessthan3characters").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should ignore default options", function () {
        dom.render(
            <div>
                <div id="target-1">1</div>
                <div id="target-2">1</div>
                <div id="target-3" style={{display: "none"}}>1</div>
                <div id="target-4" style={{display: "none"}}>1</div>
            </div>
        );

        glance.addExtension({
            options: {
                "include-hidden": function ({elements}, resultHandler) {
                    return resultHandler(null, elements);
                }
            }
        });

        return glance("1#include-hidden").should.deep.equal(dom.get("target-1", "target-2", "target-3", "target-4"));
    });

    it("should support setting the locator", function () {
        dom.render(
            <div>
                <div>abcdef</div>
                <div id="target">bcd</div>
                <div>abc def</div>
                <div>1234</div>
            </div>
        );

        glance.addExtension({
            options: {
                "exact-match": {
                    locate: function ({label, scopeElement}, callback) {
                        var xpathResult = document.evaluate(".//*[not(self::script) and text()='" + label + "']", scopeElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        var results = [];
                        for (var i = 0; i < xpathResult.snapshotLength; i++) {
                            results.push(xpathResult.snapshotItem(i));
                        }

                        return callback(null, results);
                    }
                }
            }
        });

        return glance("bcd#exact-match").should.deep.equal(dom.get("target"));
    });

    it("should still use default filters if specified options don't have filters", function () {
        dom.render(<span id="target"></span>)

        glance.addExtension({
            options: {
                "optionwithoutfilter": {}
            }
        });

        return glance("span#optionwithoutfilter").should.deep.equal(dom.get('target'));
    });

    it("should narrow down element with inner selectors", function () {
        dom.render(<div>
            <span className="block">other</span>
            <span id="target" className="block">item</span>
            <span>item</span>
        </div>);

        return glance("item ^ block").should.deep.equal(dom.get('target'));
    });

    it("should narrow down elements with inner selectors", function () {
        dom.render(<div>
            <span id="target-1" className="block">item</span>
            <span>item</span>
            <span id="target-2" className="block">item</span>
        </div>);

        return glance("item ^ block").should.deep.equal(dom.get('target-1', 'target-2'));
    });
});

describe('Intersection tests', function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });
    it("should interesect on class even if one is a leaf node", function () {
        dom.render(<div id="target" className="blue circle">
            <svg>
                <circle></circle>
            </svg>
        </div>);

        return Promise.all([
            glance("blue ^ circle").should.deep.equal(dom.get("target")),
            glance("circle ^ blue").should.deep.equal(dom.get("target"))
        ])
    });
});
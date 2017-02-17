import defaultExtensions from './extensions/default';
import defaultOptions from './default-options';
import LineageGuide from './guide';
import dom from "../test/dom";

describe("Guide: Search lineage", function () {
    let lineageGuide;

    let config = {
        defaultOptions: defaultOptions,
        extensions: defaultExtensions.concat({
            labels: {
                "customlabel": function (data, callback) {
                    return callback(null, dom.get("custom"));
                },

                "customClassLabel": function (data, callback) {
                    return callback(null, dom.get("target"));
                }
            }
        })
    }

    beforeEach(function () {
        config.rootElement = document.body;
        document.body.innerHTML = "";
        lineageGuide = new LineageGuide();
    });

    it("should find within a container", function () {
        dom.render(
            <div className="parent">
                <div id="target">child</div>
            </div>
        );

        lineageGuide.search("parent > child", config).should.deep.equal([dom.get('target')]);
    });

    it("should find next to", function () {
        dom.render(
            <div className="parent">
                <div>sibling 1</div>
                <div id="target">sibling 2</div>
            </div>
        );

        lineageGuide.search("sibling 1 > sibling 2", config).should.deep.equal([dom.get('target')]);
    });

    it("should find all children within a container", function () {
        dom.render(
            <div className="parent">
                <div id="target-1">child</div>
                <div id="target-2">another one</div>
            </div>
        );

        lineageGuide.search("parent>div", config).should.deep.equal(dom.get('target-1', 'target-2'));
    });

    it("should traverse the dom looking for items in multiple containers", function () {
        dom.render(
            <div className="box3">
                <div className="inner-box">
                    <div className="box3-item-1">Item 1 in box 3</div>
                    <div className="box3-item-2" id="target">Item 2</div>
                </div>
            </div>
        );

        lineageGuide.search("Item 1 in box 3>Item 2", config).should.deep.equal([dom.get('target')]);
    });

    it("should find duplicates at different levels", function () {
        dom.render(
            <div className="box4">
                <div className="inner-box">
                    <div className="box4-item-1">Item 1</div>
                    <div className="box4-duplicate-a" id="target-1">Duplicate A</div>
                    <div className="inner-inner-box">
                        <div className="box4-item-2">Item 2</div>
                        <div className="box4-duplicate-a-2" id="target-2">Duplicate A</div>
                    </div>
                </div>
            </div>
        );

        lineageGuide.search("box4>Duplicate A", config).should.deep.equal(dom.get('target-1', 'target-2'));
    });

    it("should traverse the dom looking for items in parent containers", function () {
        dom.render(
            <div className="box5">
                <div className="inner-box">
                    <div className="box5-item-1" id="target">Item 1</div>
                </div>
                <div className="inner-box">
                    <div className="box5-item-2">Item 2</div>
                </div>
            </div>
        );

        lineageGuide.search("box5>inner-box>Item 1", config).should.deep.equal([dom.get('target')]);
    });

    it("should only crawl parents til first find", function () {
        dom.render(
            <div className="box6">
                <div>
                    <div>
                        <div>
                            <div className="box6-item-A" id="target">Item A</div>
                            <div>
                                <div className="box6-item-B">Item B</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="box6-item-A-2">Item A</div>
                    </div>
                </div>
            </div>
        );

        lineageGuide.search("Item B>Item A", config).should.deep.equal([dom.get('target')]);
    });

    it("should look by class near a container", function () {
        dom.render(
            <div className="box7">
                <div>Item Content</div>
                <div className="class-name" id="target"></div>
            </div>
        );

        lineageGuide.search("box7>Item Content>class-name", config).should.deep.equal([dom.get('target')]);
    });

    it("should look by node type near a container", function () {
        dom.render(
            <div className="box8">
                <div>Item Content</div>
                <input className="input-near-content" id="target"/>
            </div>
        );

        lineageGuide.search("Item Content>input-near-content", config).should.deep.equal([dom.get('target')]);
    });

    it("should look within a custom label", function () {
        dom.render(
            <div className="box9">
                <div className="random">
                    <div>Custom data</div>
                    <div id="custom">
                        <div className="box9-item-1" id="target">Item 1</div>
                    </div>
                </div>
            </div>
        );

        lineageGuide.search("box9>customlabel>Item 1", config).should.deep.equal([dom.get('target')]);
    });

    it("should find the custom label in container", function () {
        dom.render(
            <div className="box10">
                <div className="custom-class">Outside</div>
                <div>
                    <div className="label-container">
                        <div>Container Label For Custom Class</div>
                        <div className="custom-class" id="target">Inside</div>
                    </div>
                    <div className="label-container">
                        <div>Another Container Label For Another Custom Class</div>
                        <div className="custom-class">Inside 2</div>
                    </div>
                </div>
            </div>
        );

        lineageGuide.search("Container Label For Custom Class>customClassLabel", config).should.deep.equal([dom.get('target')]);
    });

    it("Should limit and narrow the search to containers found", function () {
        dom.render(
            <div className="box11">
                <div className="outer-parent">
                    <div className="parent">
                        <div>reference 1</div>
                        <div className="target-1" id="target">target</div>
                    </div>
                    <div className="parent">
                        <div className="target-2">target</div>
                    </div>
                </div>
            </div>
        );

        lineageGuide.search("reference 1 > parent > target", config).should.deep.equal([dom.get('target')]);
    });

    it("Should get duplicates within multiple scopes", function () {
        dom.render(
            <div>
                <div>
                    <div>item A</div>
                    <div id="target-1">item B</div>
                </div>
                <div>
                    <div>item A</div>
                    <div id="target-2">item B</div>
                </div>
            </div>
        );

        lineageGuide.search("item A > item B", config).should.deep.equal(dom.get('target-1', 'target-2'));
    });

    it("Should get nth position for a simple list", function () {
        dom.render(
            <div>
                <div>item 1</div>
                <div>item 2</div>
                <div id="target">item 3</div>
                <div>item 4</div>
                <div>item 5</div>
            </div>
        );

        lineageGuide.search("item#3", config).should.deep.equal([dom.get('target')]);
    });

    it("Should get nth position for a scopeElement", function () {
        dom.render(
            <div>
                <div>
                    <div>item 1</div>
                    <div>another A</div>
                </div>
                <div>
                    <div>item 2</div>
                    <div id="target">another A</div>
                </div>
            </div>
        );

        lineageGuide.search("item#2 > another A", config).should.deep.equal([dom.get('target')]);
    });

    it("Should get nth position for a target in a scopeElement", function () {
        dom.render(
            <div>
                <div>
                    <div>item 1</div>
                    <div>another A</div>
                </div>
                <div>
                    <div>item 2</div>
                    <div id="target">another A</div>
                </div>
            </div>
        );

        lineageGuide.search("item > another A#2", config).should.deep.equal([dom.get('target')]);
    });

    it("Should not have a scope match the end target", function () {
        dom.render(
            <div>
                <div className="thing">item</div>
            </div>
        );

        lineageGuide.search("thing > item", config).should.deep.equal([]);
    });

    it("should narrow down scope elements with inner selectors", function () {
        dom.render(<div>
            <span className="block wide">
                <div id="target">item</div>
            </span>
            <span>item</span>
        </div>);

        lineageGuide.search("block^wide > item", config).should.deep.equal([dom.get('target')]);
    });

    it("should find a non intersecting element even if the scope collides", function () {
        dom.render(<div>
            <div className="item">
                <span id="target">item</span>
            </div>
        </div>);

        lineageGuide.search("item > target", config).should.deep.equal([dom.get('target')]);
    });

    it("should narrow down the discovered container", function () {
        dom.render(<div>
            <div>
                <div>anchor</div>
                <div>inner-scope</div>
            </div>
            <div>outside</div>
        </div>)

        lineageGuide.search("anchor > inner-scope > outside", config).should.deep.equal([])
    });
});
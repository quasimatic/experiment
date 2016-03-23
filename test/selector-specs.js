import glance from '../src/selector';
import dom from "./dom";


import log from '../src/logger';

describe("Glance", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should look by exact text match", function () {
        var div = dom.create("div", "Content Item");
        return glance("Content Item").should.deep.equal(div);
    });

    it("should look by content as contains", function () {
        var div = dom.create("div", "Item Contains stuff");
        return glance("Item Contains").should.deep.equal(div);
    });

    it('will look by id', function () {
        var div = dom.create("div", "", {id: "label-id"});
        return glance("label-id").should.deep.equal(div)
    });

    it("should look by class", function () {
        var div = dom.create("div", "", {class: "div-class"});
        return glance("div-class:html").should.deep.equal(div);
    });

    it("should look by node type", function () {
        var button = dom.create("button");
        return glance("button").should.deep.equal(button)
    });

    it("should support an indexer", function () {
        var div = dom.create("div", "foo");
        var div2 = dom.create("div", "foo");

        return glance("div#2").should.deep.equal(div2)
    });

    it("should support a parent indexer", function () {
        var header1 = dom.create("h2");
        var header2 = dom.create("h2");
        var div1 = dom.create("div", "Shared Title", {parent: header1});
        var div2 = dom.create("div", "Shared Title", {parent: header2});

        return glance("h2#2>Shared Title").should.deep.equal(div2);
    });

    it("should look for text in a node that contains text and a node", function () {
        var div = dom.createDiv("");
        var text = dom.createText("text and nodes", {parent: div});
        var div2 = dom.createDiv("this is something", {parent: div});
        glance.setLogLevel('trace')
        return glance("text and nodes").should.deep.equal(div)
    });

    it("should get duplicates", function () {
        var div1 = dom.create("div", "Duplicate");
        var div2 = dom.create("div", "Duplicate");
        return glance("Duplicate").should.deep.equal([div1, div2]);
    });

    it("should get duplicates for first type of match", function () {
        var div1 = dom.createDiv("", {class: 'item'});
        var div2 = dom.createDiv("", {class: 'item'});
        var div3 = dom.createDiv("item");
        var div4 = dom.createDiv("this is an item");

        return glance("item").should.deep.equal([div3, div4]);
    });

    it("should show an error if element not found", function () {
        return glance("item-not-found").should.deep.equal([]);
    });

    it("should look by custom labels", function () {
        var random = dom.createDiv("", {class: "random"});
        var div1 = dom.createDiv("one", {parent: random});
        var div2 = dom.createDiv("two", {parent: random});

        glance.addCustomLabels({
            "customlabel": function (g, selector) {
                return g("random>div#2");
            }
        });
        glance("customlabel").should.deep.equal(div2);
    });

    it("should only search visible elements", function () {
        var div1 = dom.create("div", "Duplicate");
        var div2 = dom.create("div", "Duplicate", {style: "display: none;"});
        return glance("Duplicate").should.deep.equal(div1);
    })

    it("should limit to next sibling", function () {
        var wrapper1 = dom.create("div");
        var wrapper2 = dom.create("div");

        var label1 = dom.create("label", "label", {parent: wrapper1});
        var input1 = dom.create("input", "", {parent: wrapper1})
        var label2 = dom.create("label", "another", {parent: wrapper1});
        var input2 = dom.create("input", "", {parent: wrapper1})

        var label3 = dom.create("label", "label", {parent: wrapper2});
        var input3 = dom.create("input", "", {parent: wrapper2})
        var label4 = dom.create("label", "another", {parent: wrapper2});
        var input4 = dom.create("input", "", {parent: wrapper2})

        return glance("label>input").should.deep.equal([input1, input3]);
    });

    it("should find text in select option", function () {
        var select = dom.create("select", "", {id: "select-1"});
        var text1 = dom.create("option", "text1", {value: "value1", parent: select});
        dom.create("option", "text2", {value: "value2", parent: select});
        return glance("select-1>text1").should.deep.equal(text1);
    })
});
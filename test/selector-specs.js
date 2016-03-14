import glance from '../src/glance-selector';
import dom from "./dom";


import log from '../src/logger';
log.setLogLevel('trace');

describe("Glance", function () {
    it("should look by exact text match", function () {
        var div = dom.create("div", "Content Item");
        return glance("Content Item").should.deep.equal(div);
    });

    it("should look by content as contains", function () {
        var div = dom.create("div", "Item Contains stuff");
        return glance("Item Contains").should.deep.equal(div);
    });

    it("should look by exact match first then contains", function () {
        var div1 = dom.create("div", "Item Exact Match");
        var div2 = dom.create("div", "Item Exact Match Sorta");
        return glance("Item Exact Match").should.deep.equal(div1);
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
        var header1 = dom.create("h2");
        var header2 = dom.create("h2");
        var div1 = dom.create("div", "Shared Title", {parent: header1});
        var div2 = dom.create("div", "Shared Title", {parent: header2});

        return glance("h2#2>Shared Title").should.deep.equal(div2);
    });

    it("should look for text in a node that contains text and a node", function () {
        var div = dom.create("div");
        var text = dom.createText("text and nodes", {parent: div});
        return glance("text and nodes").should.deep.equal(div)
    });

    it("should get duplicates", function () {
        var div1 = dom.create("div", "Duplicate");
        var div2 = dom.create("div", "Duplicate");
        return glance("Duplicate").should.deep.equal([div1, div2]);
    });

    it("should get duplicates for first type of match", function () {
        var div1 = dom.create("div", "Copy Exact Match");
        var div2 = dom.create("div", "Copy Exact Match");
        dom.create("div", "Not Copy Exact Match");
        dom.create("div", "Copy Exact Match Not");

        return glance("Copy Exact Match").should.deep.equal([div1, div2]);
    });

    it("should show an error if element not found", function () {
        return glance("item-not-found").should.deep.equal([]);
    });

    it.skip("should look by custom labels", function () {
        glance.addLabel("customlabel", function (selector) {
            return this.convertGlanceSelector(".random>div#2").then((wdioSelector)=> this.webdriverio.element(wdioSelector))
        });

        glance.get("customlabel").should.eventually.match(/<div.*>Other Custom Data<\/div>/);
    });
});
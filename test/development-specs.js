import glance from '../src/selector'
import dom from "./dom"
// import PartialBreak from '../src/partial-break'

describe.skip("Glance: Development mode", () => {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should return found subject elements", () => {
        dom.render(
            <div id="target"></div>
        );

        return glance("target", {development: true}).subjectElements.should.deep.equal(dom.get("target"));
    });

    it("should return scope elements", () => {
        dom.render(
            <div id="scope">
                <div id="target"></div>
            </div>
        );

        return glance("scope > target", {development: true}).scopeElements.should.deep.equal([dom.get("scope")]);
    })

    it("should return container elements", () => {
        dom.render(
            <div id="container">
                <div id="scope"></div>
                <div id="target"></div>
            </div>
        )

        return glance("scope > target", {development: true}).containerElements.should.deep.equal([dom.get("container")]);
    });
});

describe.skip("Development mode: Partials", () => {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should provide a partial result at a scope", () => {
        dom.render(
            <div id="scope">
                <div id="target"></div>
            </div>
        );

        glance.addExtension({
            labels: {
                "stop-target": function (data, callback) {
                    // function PartialBreak() {}
                    // PartialBreak.prototype = new Error("Locator Break");
                    // throw new PartialBreak();
                    throw new Error("LOCATOR_BREAK");
                }
            }
        });

        let result = glance("scope > stop-target", {development: true});

        result.scopeElements.should.deep.equal([dom.get("scope")]);
        result.elements.should.deep.equal([]);
        // result.next.should.deep.equal({
        //     type: "label",
        //     value: "stop-target"
        // });
    });

    it.skip("should provide a partial result a filter", () => {
        dom.render(
            <div id="target"></div>
        )

        glance.addExtension({
            options: {
                "option1": function({elements}, callback){
                   return callback(null, elements)
                },
                "option2": function() {
                   throw new Error("FILTER_BREAK");
                }
            }
        });

        let result = glance("target#option1,option2", {development: true});

        result.processed.should.deep.equal([{
            label: 'target',
            options: ["option1"],
            projections: [],
            scope: '',
            path: 'scope',
            type: 'scope',
            scopeIndex: 0
        }]);
    });
});
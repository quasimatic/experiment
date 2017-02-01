import glance from '../src/selector'
import dom from "./dom"
import PartialBreak from '../src/partial-break'

describe("Glance: Development mode", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should return found elements", function () {
        dom.render(
            <div id="target"></div>
        );

        return glance("target", {development: true}).elements.should.deep.equal(dom.get("target"));
    });

    it("should return scopes", function () {
        dom.render(
            <div id="scope">
                <div id="target"></div>
            </div>
        );

        return glance("scope > target", {development: true}).scopeElements.should.deep.equal([dom.get("scope")]);
    })

    it("should return containers", function () {
        dom.render(
            <div id="container">
                <div id="scope"></div>
                <div id="target"></div>
            </div>
        )

        return glance("scope > target", {development: true}).containerElements.should.deep.equal([dom.get("container")]);
    });

    it("should provide a partial result at a scope", function () {
        dom.render(
            <div id="scope">
                <div id="target"></div>
            </div>
        );

        glance.addExtension({
            labels: {
                "stoptarget": function (data, callback) {
                    throw new PartialBreak();
                }
            }
        });

        let result = glance("scope > stoptarget", {development: true});

        result.scopeElements.should.deep.equal([dom.get("scope")]);
        result.elements.should.deep.equal([]);
        result.processed.should.deep.equal([{
            label: 'scope',
            options: [],
            transforms: [],
            scope: '',
            path: 'scope',
            type: 'scope',
            scopeIndex: 0
        }])
    });
});
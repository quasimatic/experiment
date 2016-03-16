import dom from "../dom"
import findByCustomLabel from '../../src/find-strategies/custom-label';

describe("Find strategy: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by a custom label as an element", function() {
        var div = dom.createDiv("This is custom", {class: "custom-label"});

        findByCustomLabel("my-own-label", document, {
            "my-own-label": div
        }).should.deep.equal([div]);
    });

    it("should find by a custom label a function", function() {
        var div = dom.createDiv("This is custom", {id: "custom-label"});

        findByCustomLabel("my-own-label", document, {
            "my-own-label": function() {
                return document.getElementById("custom-label")
            }
        }).should.deep.equal([div]);
    });

    it("should not find custom label not in container", function() {
        var wrapper1 = dom.createDiv("This is custom", {class: "wrapper1"});
        var wrapper2 = dom.createDiv("This is custom", {class: "wrapper2"});
        var div = dom.createDiv("This is custom", {parent: wrapper1});

        findByCustomLabel("my-own-label", wrapper2, {
            "my-own-label": div
        }).should.deep.equal([]);
    });
});
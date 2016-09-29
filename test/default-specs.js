import glance from '../src/selector';
import dom from "./dom"

describe("Defaults: Attributes", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find in alt attribute", function () {
        dom.render(<img alt="image-name" id="target"/>)
        return glance("image-name").should.deep.equal(dom.get("target"));
    });

    it("should find by id", function () {
        dom.render(<div id="unique-id">text</div>);
        return glance("unique-id").should.deep.equal(dom.get("unique-id"));
    });

    it("should find in placeholder", function() {
        dom.render(<input placeholder="enter name" id="target"/>);
        return glance("enter name").should.deep.equal(dom.get("target"));
    });
});
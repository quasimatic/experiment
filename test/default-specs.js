import glance from '../src/selector';
import dom from "./dom"

describe("Default: Attribute alt", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find in alt attribute", function () {
        dom.render(<img alt="image-name" id="target"/>)
        return glance("image-name").should.deep.equal(dom.get("target"));
    });

    it("should find in alt attribute case insensitive", function () {
        dom.render(<img alt="image-name" id="target"/>)
        return glance("ImagE-nAme").should.deep.equal(dom.get("target"));
    });

    it("should find as contains in alt attribute", function () {
        dom.render(<img alt="image-name" id="target"/>)
        return glance("image-").should.deep.equal(dom.get("target"));
    });
});

describe("Default: Attribute id", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find by id", function () {
        dom.render(<div id="unique-id">text</div>);
        return glance("unique-id").should.deep.equal(dom.get("unique-id"));
    });

    it("should not find by id", function () {
        dom.render(<div id="unique-id"></div>);
        return glance("missing-id").should.deep.equal([]);
    });
});

describe("Default: Attribute placeholder", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find in placeholder", function() {
        dom.render(<input placeholder="enter name" id="target"/>);
        return glance("enter name").should.deep.equal(dom.get("target"));
    });

    it("should find in placeholder case insensitive", function() {
        dom.render(<input placeholder="eNter namE" id="target"/>)
        return glance("enteR naMe").should.deep.equal(dom.get("target"));
    });
});
import dom from "../../../test/dom"
import extension from './attribute';

describe("Locator: Search in attributes", function() {
    let locate = extension.locator.locate;
    
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find exact match", function() {
        dom.render(<img alt="image-name" id="target"/>)
        locate({label:"image-name", target:{options:["attribute-alt"]}, scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find case insensitive", function() {
        dom.render(<img id="target"/>)
        locate({label:"taRGet", target:{options:["attribute-id"]}, scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find as contains", function() {
        dom.render(<img id="target" placeholder="enter first name"/>)
        locate({label:"first", target:{options:["attribute-placeholder"]}, scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should not find if missing", function () {
        dom.render(<div id="unique-id"></div>);
        locate({label: "missing-id", target:{options:["attribute-id"]}, scopeElement: document.body}).should.deep.equal([]);
    });
});
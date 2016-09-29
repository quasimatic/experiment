import dom from "../dom"
import extension from '../../src/extensions/attribute';

describe("Locator: Search in attributes", function() {
    let locate = extension.locate;
    
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find exact match", function() {
        dom.render(<img alt="image-name" id="target"/>)
        locate({label:"image-name", target:{properties:["attribute-alt"]}, scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find case insensitive", function() {
        dom.render(<img id="target"/>)
        locate({label:"taRGet", target:{properties:["attribute-id"]}, scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find as contains", function() {
        dom.render(<img id="target" placeholder="enter first name"/>)
        locate({label:"first", target:{properties:["attribute-placeholder"]}, scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should not find if missing", function () {
        dom.render(<div id="unique-id"></div>);
        locate({label: "missing-id", target:{properties:["attribute-id"]}, scopeElement: document.body}).should.deep.equal([]);
    });
});
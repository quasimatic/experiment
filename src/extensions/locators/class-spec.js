import dom from "../../../test/dom"
import extension from './class';

describe("Locator: Class", function() {
    let findByClass = extension.options["class"].locate;
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by class name", function() {
        dom.render(<div className="class-name" id="target">text</div>);

        findByClass({label:"class-name", containerElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should not find by class name", function() {
        dom.render(<div className="class-name">text</div>);

        findByClass({label:"missing-class", containerElement:document.body}).should.deep.equal([]);
    });
});
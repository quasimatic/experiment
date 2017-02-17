import dom from "../../../test/dom"
import extension from './exact-text';

describe("Locator: Exact Match", function() {
    let findExactText = extension.options["exact-text"].locate;
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by exact text match", function() {
        dom.render(<div id="target">exact text</div>);

        findExactText({label:"exact text", containerElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should not find containing match", function() {
        dom.render(<div>not so exact text here</div>);

        findExactText({label:"exact text", containerElement:document.body}).should.deep.equal([]);
    });

    it("should find more than one", function() {
        dom.render(<div>
            <div id="target-1">exact text</div>
            <div id="target-2">exact text</div>
        </div>);

        findExactText({label:"exact text", containerElement:document.body}).should.deep.equal(dom.get("target-1", "target-2"));
    })
});
import dom from "../dom"
import extension from '../../src/extensions/search-as-class-name';

describe("Locator: Exact Match", function() {
    let findByClassName = extension.properties.searchasclassname.locate;
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by class name", function() {
        dom.render(<div className="class-name" id="target">text</div>);

        findByClassName({label:"class-name", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should not find by class name", function() {
        dom.render(<div className="class-name">text</div>);

        findByClassName({label:"missing-class", scopeElement:document.body}).should.deep.equal([]);
    });
});
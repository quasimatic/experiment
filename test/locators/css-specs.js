import dom from "../dom"
import findByCSS from '../../src/extensions/lib/css';

describe("Locator: Exact Match", function() {
    beforeEach(function(){
        document.body.innerHTML = "";
    });

    it("should find by css selector", function() {
        dom.render(<div className="class-name" id="target">text</div>);

        findByCSS(".class-name", document).should.deep.equal([dom.get("target")]);
    });

    it("should find within a scope css selector", function() {
        dom.render(<div id="scope">
            <div className="class-name" id="target">text</div>
        </div>);

        findByCSS(".class-name", dom.get("scope")).should.deep.equal([dom.get("target")]);
    });

    it("should find scope with css selector", function(){
        dom.render(<div id="scope">
            <div className="class-name" id="target">text</div>
        </div>);

        findByCSS(".class-name", dom.get("target")).should.deep.equal([dom.get("target")]);
    });

    it("should not find by css selector", function() {
        dom.render(<div className="class-name">text</div>);

        findByCSS(".missing-class", document).should.deep.equal([]);
    });
});
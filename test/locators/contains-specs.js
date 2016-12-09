import dom from "../dom"
import extension from '../../src/extensions/contains';

describe("Locator: Contains Match", function () {
    let findContainsText = extension.options["contains"].locate;
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find by exact text match", function () {
        dom.render(<div id="target">contains text</div>);

        findContainsText({label:"contains text", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find containing match", function () {
        dom.render(<div id="target">this contains text here</div>);

        findContainsText({label:"contains text", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find more than one", function () {
        dom.render(
            <div>
                <div id="target-1">contains text</div>
                <div id="target-2">this contains text here</div>
            </div>
        );

        findContainsText({label:"contains text", scopeElement:document.body}).should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should not find missing text", function () {
        dom.render(<div>contains text</div>);

        findContainsText({label:"missing text", scopeElement:document.body}).should.deep.equal([]);
    });

    it("should find by case insensitive", function () {
        dom.render(<div id="target">conTainS teXt</div>);

        findContainsText({label:"Contains teXt", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find inside a textnode", function () {
        dom.render(<div>
            <div id="target"><span>something</span>text node</div>
        </div>);

        findContainsText({label:"text node", scopeElement:document.body}).should.deep.equal([dom.get("target")]);
    });

    it("should find ")

    it("should not search script tags", function () {
        dom.render(<script>console.log('stuff')</script>);

        findContainsText({label:"stuff", scopeElement:document.body}).should.deep.equal([]);
    });

    it("should not search noscript tags", function () {
        dom.render(<noscript>console.log('stuff')</noscript>);

        findContainsText({label:"stuff", scopeElement:document.body}).should.deep.equal([]);
    });

    it("should not search style tags", function () {
        dom.render(<style>{ "color: red;" }</style>);

        findContainsText({label:"red", scopeElement:document.body}).should.deep.equal([]);
    });
});
import dom from "../dom"
import findContainsText from '../../src/locators/contains-text';

describe("Locator: Contains Match", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should find by exact text match", function () {
        dom.render(<div id="target">contains text</div>);

        findContainsText("contains text", document).should.deep.equal([dom.get("target")]);
    });

    it("should find containing match", function () {
        dom.render(<div id="target">this contains text here</div>);

        findContainsText("contains text", document).should.deep.equal([dom.get("target")]);
    });

    it("should find more than one", function () {
        dom.render(
            <div>
                <div id="target-1">contains text</div>
                <div id="target-2">this contains text here</div>
            </div>
        );

        findContainsText("contains text", document).should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should not find missing text", function () {
        dom.render(<div>contains text</div>)

        findContainsText("missing text", document).should.deep.equal([]);
    })

    it("should find by case insensitive", function () {
        dom.render(<div id="target">conTainS teXt</div>)

        findContainsText("Contains teXt", document).should.deep.equal([dom.get("target")]);
    })

    it("should find inside a textnode", function () {
        dom.render(<div>
            <div id="target">text node</div>
        </div>)

        findContainsText("text node", document).should.deep.equal([dom.get("target")]);
    })

    it("should not search script tags", function () {
        dom.render(<script>console.log('stuff')</script>)

        findContainsText("stuff", document).should.deep.equal([]);
    })

    it("should not search noscript tags", function () {
        dom.render(<noscript>console.log('stuff')</noscript>)

        findContainsText("stuff", document).should.deep.equal([]);
    })

    it("should not search style tags", function () {
        dom.render(<style>{ "color: red;" }</style>)

        findContainsText("red", document).should.deep.equal([]);
    })
});
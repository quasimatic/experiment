import dom from "../dom"
import findByCustomLabel from '../../src/locators/custom-label';

describe("Locator: Custom Label", function() {
    beforeEach(function() {
        document.body.innerHTML = "";
    });

    it("should find by a custom label a function", function() {
        dom.render(<div id="custom-label">This is custom</div>);

        findByCustomLabel("my-own-label", document, {
            extensions: [{
                labels: {
                    "my-own-label": {
                        locate: function() {
                            return document.getElementById("custom-label")
                        }
                    }
                }
            }]
        }).should.deep.equal([dom.get("custom-label")]);
    });

    it("should find an element using a preload", function() {
        dom.render(<div className="custom-label" id="target">This is custom</div>);

        findByCustomLabel("my-own-label", document, {
            preload: {
                labels: {
                    "my-own-label": dom.get("target")
                }
            }
        }).should.deep.equal([dom.get("target")]);
    });

    it("should find an array of elements using a preload", function () {
        dom.render(<div>
            <div className="custom-label" id="target-1">This is custom</div>
            <div className="custom-label" id="target-2"t>This is custom</div>
        </div>);

        findByCustomLabel("my-own-label", document, {
            preload: {
                labels: {
                    "my-own-label": dom.get("target-1", "target-2")
                }
            }
        }).should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should find items within an array within a context using a preload", function () {
        dom.render(<div>
            <div id="wrapper-1">
                <div id="other">Div 1</div>
            </div>
            <div id="wrapper-2">
                <div id="target">Div 2</div>
            </div>
        </div>);

        findByCustomLabel("my-own-label", dom.get("wrapper-2"), {
            preload: {
                labels: {
                    "my-own-label": dom.get("other", "target")
                }
            }
        }).should.deep.equal([dom.get("target")]);
    });

    it("should not find custom label not in scope", function () {
        dom.render(<div>
            <div id="wrapper1">
                This is custom
                <div id="target">This is custom</div>
            </div>
            <div id="wrapper2">This is custom</div>
        </div>);

        findByCustomLabel("my-own-label", dom.get("wrapper2"), {
            preload: {
                labels: {
                    "my-own-label": dom.get("target")
                }
            }
        }).should.deep.equal([]);
    });
});
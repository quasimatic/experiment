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
});
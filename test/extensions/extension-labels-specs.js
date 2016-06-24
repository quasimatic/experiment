import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: labels", function() {
    beforeEach(function() {
        document.body.innerHTML = "";

        dom.render(
            <div>
                <div id="target"></div>
            </div>
        );
    });

    it("should locate elements for a custom label", function () {
        glance.addExtension({
            labels: {
                "custom-label": {
                    locate: function(label, scope, config) {
                        return config.glance("target");
                    }
                }
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    });

    it("should locate elements for a custom label as a function", function () {
        glance.addExtension({
            labels: {
                "custom-label": function (label, scope, config) {
                    return config.glance("target");
                }
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    });

    it("should have beforeLocate", function() {
        let actualLabel;
        glance.addExtension({
            labels: {
                "custom-label": {
                    beforeLocate: function({label}) {
                        actualLabel = label;
                    }
                }
            }
        });

        glance("custom-label");

        return actualLabel.should.deep.equal("custom-label");
    });

    it("should have afterLocate", function() {
        let actualLabel;
        glance.addExtension({
            labels: {
                "custom-label": {
                    afterLocate: function({label}) {
                        actualLabel = label;
                    }
                }
            }
        });

        glance("custom-label");

        return actualLabel.should.deep.equal("custom-label");
    });
});
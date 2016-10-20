import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: labels", function () {
    beforeEach(function () {
        document.body.innerHTML = "";

        dom.render(
            <div>
                <div id="target"></div>
                <div id="something-else"><div id="item-1"></div></div>
            </div>
        );
    });

    it("should locate elements for a custom label", function () {
        glance.addExtension({
            labels: {
                "custom-label": {
                    locate: function ({glance}, resultHandler) {
                        return resultHandler(null, glance("target"));
                    }
                }
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    });

    it("should locate elements for a custom label as a function", function () {
        glance.addExtension({
            labels: {
                "custom-label": function ({glance}, resultHandler) {
                    return resultHandler(null, glance("target"));
                }
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    });

    it("should locate elements for a custom label as a glance selector", function () {
        glance.addExtension({
            labels: {
                "custom-label": "target"
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    });

    it("should locate elements for a custom label as an array", function () {
        glance.addExtension({
            labels: {
                "custom-label": ["missing", "target", "something-else"]
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target", "something-else"));
    });

    it("should locate elements with a scope as a custom label as an array", function () {
        glance.addExtension({
            labels: {
                "custom-label": ["missing", "target", "something-else"]
            }
        });

        return glance("custom-label > item-1").should.deep.equal(dom.get("item-1"));
    });

    it("should have beforeLocate", function () {
        let actualLabel;
        glance.addExtension({
            labels: {
                "custom-label": {
                    beforeLocate: function ({label}) {
                        actualLabel = label;
                    }
                }
            }
        });

        glance("custom-label");

        return actualLabel.should.deep.equal("custom-label");
    });

    it("should have afterLocate", function () {
        let actualLabel;
        glance.addExtension({
            labels: {
                "custom-label": {
                    afterLocate: function ({label}) {
                        actualLabel = label;
                    }
                }
            }
        });

        glance("custom-label");

        return actualLabel.should.deep.equal("custom-label");
    });
});
import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: property", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
        dom.render(
            <div>
                <div className='item' id="target-1"></div>
                <div className='item'></div>
                <div className='item' id="target-2"></div>
                <div className='item'></div>
                <input className='custom-input' id="target-3"/>
            </div>
        );
    });

    it("should filter elements", function () {
        glance.addExtension({
            properties: {
                "every-other": {
                    filter: function ({elements}, resultHandler) {
                        let i = 0;
                        return resultHandler(null, elements.filter(e => ++i % 2));
                    }
                }
            }
        });

        return glance("item#every-other").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should filter elements as a function", function () {
        glance.addExtension({
            properties: {
                "every-other": function ({elements}, resultHandler) {
                    let i = 0;
                    return resultHandler(null, elements.filter(e => ++i % 2));
                }
            }
        });

        return glance("item#every-other").should.deep.equal(dom.get("target-1", "target-2"));
    });

    it("should locate elements with a property", function () {
        glance.addExtension({
            properties: {
                "custom-property": {
                    locate: function({glance}, resultHandler) {
                        return resultHandler(null, glance("custom-input"));
                    }
                }
            }
        });

        return glance("ignored#custom-property").should.deep.equal(dom.get("target-3"));
    });

    it("should locate elements for a custom property as a glance selector", function () {
        glance.addExtension({
            properties: {
                "custom-property": {
                    locate: "custom-input"
                }
            }
        });

        return glance("ignored#custom-property").should.deep.equal(dom.get("target-3"));
    });
});
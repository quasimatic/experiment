import glance from '../src/selector';
import dom from "./dom"

describe("Extensions: labels", function() {
    beforeEach(function() {
        document.body.innerHTML = "";
    });

    it("should find elements for a custom label", function() {
        dom.render(
            <div>
                <div id="target"></div>
            </div>
        );

        glance.addExtension({
            labels: {
                "custom-label": {
                    locate: function() {
                        return document.getElementById("target")
                    }
                }
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    })
});

describe("Extensions: modifiers", function() {
    beforeEach(function() {
        document.body.innerHTML = "";
    });

    it("should filter elements", function() {
        dom.render(
            <div>
                <div className='item' id="target-1"></div>
                <div className='item'></div>
                <div className='item' id="target-2"></div>
                <div className='item'></div>
            </div>
        );

        glance.addExtension({
            modifiers: {
                "every-other": {
                    filter: function(elements) {
                        let i = 0;
                        return elements.filter(e => ++i % 2);
                    }
                }
            }
        });

        return glance("item:every-other").should.deep.equal(dom.get("target-1", "target-2"));
    })
});
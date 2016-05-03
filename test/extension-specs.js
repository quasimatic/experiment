import glance from '../src/selector';
import dom from "./dom"

describe("Extensions: labels", function() {
    beforeEach(function() {
        document.body.innerHTML = "";

        dom.render(
            <div>
                <div id="target"></div>
            </div>
        );
    });

    it("should find elements for a custom label", function() {
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
        dom.render(
            <div>
                <div className='item' id="target-1"></div>
                <div className='item'></div>
                <div className='item' id="target-2"></div>
                <div className='item'></div>
            </div>
        );
    });

    it("should filter elements", function() {
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
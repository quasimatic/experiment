import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: property", function() {
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
            properties: {
                "every-other": {
                    filter: function(elements) {
                        let i = 0;
                        return elements.filter(e => ++i % 2);
                    }
                }
            }
        });

        return glance("item:every-other").should.deep.equal(dom.get("target-1", "target-2"));
    });
});
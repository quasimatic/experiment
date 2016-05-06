import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: filter events", function() {
    let filterCalled = false;

    beforeEach(function() {
        filterCalled = false;
        document.body.innerHTML = "";
        dom.render(
            <div>
            </div>
        );
    });

    it("should have beforeFilter event", function() {
        glance.addExtension({
            beforeFilter: function(elements) {
                filterCalled = true;

                return elements;
            }
        });

        glance("div");
        filterCalled.should.deep.equal(true);
    });

    it("should have afterFilter event", function() {
        glance.addExtension({
            afterFilter: function(elements) {
                filterCalled = true;

                return elements;
            }
        });

        glance("div");
        filterCalled.should.deep.equal(true);
    });
});
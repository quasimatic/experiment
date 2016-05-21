import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: beforeAll", function() {
    it("should call the event", function() {
        let beforeAllCalled = false;

        glance.addExtension({
            beforeAll: function () {
                beforeAllCalled = true;
            }
        });

        glance("div");

        beforeAllCalled.should.deep.equal(true);
    });
});

describe("Extensions: afterAll", function(){
    it("should should call the event", function() {
        document.body.innerHTML = "";
        dom.render(
            <div>
                <div id="target-1">item 1</div>
                <div id="target-2">item 2</div>
            </div>
        );

        let elementsInEvent;

        glance.addExtension({
            afterAll: function({elements}) {
                elementsInEvent = elements;
            }
        });

        glance("item");

        elementsInEvent.should.deep.equal(dom.get("target-1", "target-2"));
    });
});
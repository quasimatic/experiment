import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: beforeScope event", function () {
    let eventCalled = false;

    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div class="scope">
                <div>item 1</div>
            </div>
        );

        glance.addExtension({
            beforeScope: function () {
                eventCalled = true;
            }
        });

        glance("scope > item");
    });

    it("should be called while processing a scope", function () {
        eventCalled.should.equal(true);
    });
});

describe("Extensions: afterScope event", function () {
    let eventCalled = false;
    
    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div scope>
                <div>item</div>
            </div>
        );

        glance.addExtension({
            beforeScope: function () {
                eventCalled = true;
            }
        });

        glance("scope > item");
    });

    it("should be called after scopes are finished", function () {
        eventCalled.should.equal(true);
    });
});
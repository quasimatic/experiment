import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: beforePositional event", function () {
    let elementsInEvent;
    let positionInEvent;

    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div>
                <div id="target-1">item 1</div>
                <div id="target-2">item 2</div>
            </div>
        );

        glance.addExtension({
            beforePositional: function (elements, position) {
                elementsInEvent = elements;
                positionInEvent = position;
                return elements;
            }
        });

        glance("item#1");
    });

    it("should get called before the positional filter", function () {
        elementsInEvent.should.deep.equal(dom.get("target-1","target-2"));
    });

    it("should get the position", function () {
        positionInEvent.should.equal(1);
    });
});

describe("Extensions: afterPositional event", function () {
    let elementsInEvent;
    let positionInEvent;
    
    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div>
                <div>item</div>
                <div id="target">item</div>
            </div>
        );

        glance.addExtension({
            afterPositional: function (elements, position) {
                elementsInEvent = elements;
                positionInEvent = position;
                return elements;
            }
        });

        glance("item#2");
    });

    it("should get called after the positional filter", function () {
        elementsInEvent.should.deep.equal([dom.get("target")]);
    });

    it("should get the position", function () {
        positionInEvent.should.equal(2);
    });
});
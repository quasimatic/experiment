import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: beforeFilter event", function () {
    let elementsInEvent;

    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div>
                <div id="target-1">item 1</div>
                <div id="target-2">item 2</div>
            </div>
        );

        glance.addExtension({
            properties: {
                "one": {
                    filter: function(elements) {
                        return [elements[0]];
                    }
                }
            },
            beforeFilter: function (elements) {
                elementsInEvent = elements;
                return elements;
            }
        });

        glance("item:one");
    });

    it("should happen before filters", function () {
        elementsInEvent.should.deep.equal(dom.get("target-1","target-2"));
    });
});

describe("Extensions: afterFilter event", function () {
    let elementsInEvent;
    
    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div>
                <div id="target-1">item</div>
                <div id="target-2">item</div>
            </div>
        );

        glance.addExtension({
            afterFilter: function (elements) {
                elementsInEvent = elements;
                return elements;
            }
        });

        glance("item#2");
    });

    it("should get called before positional", function () {
        elementsInEvent.should.deep.equal(dom.get("target-1","target-2"));
    });
});
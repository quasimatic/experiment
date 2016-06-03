import glance from '../src/selector';
import dom from "./dom"

// TODO preload scope
// it should fail on a bad preload selector

describe("Incremental Process", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it('should stop after processing locate', function () {
        dom.render(
            <div>
                <div id="target">item</div>
            </div>
        );

        glance("item", {
            debug: true
        }).should.deep.equal({
            selector: "item",
            located: [dom.get('target')]
        });
    });

    it('should stop after processing a filter', function () {
        dom.render(
            <div>
                <div id="target">item</div>
            </div>
        );

        glance("item:even", {
            debug: true,
            preload: {
                selector: "item:even",
                located: [dom.get('target')]
            }
        }).should.deep.equal({
            selector: "item:even",
            located: [dom.get('target')],
            filtered: [[dom.get('target')]]
        });
    });

    it('should stop after processing after each filter', function () {
        dom.render(
            <div>
                <div id="item-1">item 1</div>
                <div id="item-2">item 2</div>
                <div id="item-3">item 3</div>
                <div id="item-4">item 4</div>
            </div>
        );

        glance.addExtension({
            properties: {
                "one": {
                    filter: function (elements) {
                        return [elements[0]];
                    }
                },
                "two": {
                    filter: function (elements) {
                        return [elements[0],elements[1]];
                    }
                },
                "three": {
                    filter: function (elements) {
                        return [elements[0],elements[1],elements[2]];
                    }
                }
            }
        });

        var result = glance("item:three,two,one", {
            debug: true,
            preload: {
                selector: "item:three,two,one",
                located: dom.get('item-1', 'item-2', 'item-3', 'item-4'),
                filtered: [dom.get('item-1', 'item-2', 'item-3')]
            }
        })

        result.should.deep.equal({
            selector: "item:three,two,one",
            located: dom.get('item-1', 'item-2', 'item-3', 'item-4'),
            filtered: [dom.get('item-1','item-2', 'item-3'), dom.get('item-1','item-2')]
        });

        glance("item:three,two,one", {
            debug: true,
            preload: result
        }).should.deep.equal({
            selector: "item:three,two,one",
            located: dom.get('item-1', 'item-2', 'item-3', 'item-4'),
            filtered: [dom.get('item-1','item-2', 'item-3'), dom.get('item-1','item-2'), [dom.get('item-1')]]
        });
    });
});
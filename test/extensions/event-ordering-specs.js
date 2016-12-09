import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: labels", function () {
    let calledEvents;

    before(function () {
        calledEvents = [];
        document.body.innerHTML = "";

        dom.render(
            <div className="scope">
                <div id="custom-label">
                    <div>item 1</div>
                </div>
            </div>
        );

        glance.addExtension({
            labels: {
                "custom label": {
                    locate: function (target, callback) {
                        calledEvents.push('label locate');
                        return callback(null, [dom.get('custom-label')]);
                    },
                    filter: function ({elements}, resultHandler) {
                        calledEvents.push("label filter");
                        return resultHandler(null, elements);
                    }
                }
            },

            options: {
                "custom-option": {
                    locate: function (target, callback) {
                        calledEvents.push('option locate');
                        return callback(null, [dom.get('custom-label')]);
                    },
                    filter: function ({elements}, resultHandler) {
                        calledEvents.push('option filter');
                        return resultHandler(null, elements);
                    }
                },
                "another-option": {
                    locate: function (target, callback) {
                        calledEvents.push('option locate');
                        return callback(null, [dom.get('custom-label')]);
                    }
                }
            },

            beforeScope: function () {
                calledEvents.push('beforeScope');
            },

            afterScope: function () {
                calledEvents.push('afterScope');
            },

            beforeFilters: function ({elements}) {
                calledEvents.push('beforeFilters');
                return elements;
            },

            afterFilters: function ({elements}, resultHandler) {
                calledEvents.push('afterFilters');
                return elements;
            },

            beforeLocate() {
                calledEvents.push('beforeLocate');
            },

            afterLocate() {
                calledEvents.push('afterLocate');
            }
        });
    });

    it("should call events in correct order", function () {
        glance("scope > custom label#custom-option > item 1#another-option");
        calledEvents.should.deep.equal([
            'beforeScope',
            'beforeLocate',
            'afterLocate',
            'beforeFilters',
            'afterFilters',
            'afterScope',
            'beforeScope',
            'beforeLocate',
            'label locate',
            'option locate',
            'afterLocate',
            'beforeFilters',
            'label filter',
            'option filter',
            'afterFilters',
            'afterScope',
            'beforeScope',
            'beforeLocate',
            'option locate',
            'afterLocate',
            'beforeFilters',
            'afterFilters',
            'afterScope' ]);
    });
});
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

            properties: {
                "custom-property": {
                    locate: function (target, callback) {
                        calledEvents.push('property locate');
                        return callback(null, [dom.get('custom-label')]);
                    },
                    filter: function ({elements}, resultHandler) {
                        calledEvents.push('property filter');
                        return resultHandler(null, elements);
                    }
                },
                "another-property": {
                    locate: function (target, callback) {
                        calledEvents.push('property locate');
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
            },

            beforePositional({elements}) {
                calledEvents.push('beforePositional');
                return elements;
            },

            afterPositional({elements}) {
                calledEvents.push('afterPositional');
                return elements;
            }
        });
    });

    it("should call events in correct order", function () {
        glance("scope > custom label#custom-property > item 1#another-property");
        calledEvents.should.deep.equal([
            'beforeScope',
            'beforeLocate',
            'afterLocate',
            'beforeFilters',
            'afterFilters',
            'beforePositional',
            'afterPositional',
            'afterScope',
            'beforeScope',
            'beforeLocate',
            'label locate',
            'property locate',
            'afterLocate',
            'beforeFilters',
            'label filter',
            'property filter',
            'afterFilters',
            'beforePositional',
            'afterPositional',
            'afterScope',
            'beforeScope',
            'beforeLocate',
            'property locate',
            'afterLocate',
            'beforeFilters',
            'afterFilters',
            'beforePositional',
            'afterPositional',
            'afterScope']);
    });
});
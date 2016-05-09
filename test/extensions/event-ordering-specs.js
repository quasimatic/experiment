import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: labels", function () {
    let calledEvents = [];
    before(function () {
        document.body.innerHTML = "";

        dom.render(
            <div className="scope">
                <div id="custom-label"></div>
            </div>
        );
        
        glance.addExtension({
            labels: {
                "custom label": {
                    locate: function (label, scope, {glance}) {
                        calledEvents.push('label locate');
                        return [document.getElementById('custom-label')];
                    },
                    filter: function(elements) {
                        calledEvents.push("label filter");
                        return elements;
                    }
                }
            },

            properties: {
                "custom-property": {
                    filter: function (elements) {
                        calledEvents.push('property filter');
                        return elements;
                    }
                }
            },

            beforeScope: function () {
                calledEvents.push('beforeScope');
            },

            afterScope: function () {
                calledEvents.push('afterScope');
            },

            beforeFilter: function (elements) {
                calledEvents.push('beforeFilter');
                return elements;
            },

            afterFilter: function (elements) {
                calledEvents.push('afterFilter');
                return elements;
            },

            beforeLocate() {
                calledEvents.push('beforeLocate');
            },

            afterLocate() {
                calledEvents.push('afterLocate');
            },

            beforePositional(elements) {
                calledEvents.push('beforePositional');
                return elements;
            },

            afterPositional(elements) {
                calledEvents.push('afterPositional');
                return elements;
            }
        });

        return glance("scope > custom label:custom-property");
    });

    it("should call events in correct order", function () {
        calledEvents.should.deep.equal([
            'beforeScope',
            'beforeLocate',
            'afterLocate',
            'beforeFilter',
            'afterFilter',
            'beforePositional',
            'afterPositional',
            'afterScope',
            'beforeScope',
            'beforeLocate',
            'label locate',
            'afterLocate',
            'beforeFilter',
            'label filter',
            'property filter',
            'afterFilter',
            'beforePositional',
            'afterPositional',
            'afterScope'
        ]);
    });
});
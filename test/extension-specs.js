import glance from '../src/selector';
import dom from "./dom"

describe("Extensions: labels", function() {
    beforeEach(function() {
        document.body.innerHTML = "";

        dom.render(
            <div>
                <div id="target"></div>
            </div>
        );
    });

    it("should find elements for a custom label", function() {
        glance.addExtension({
            labels: {
                "custom-label": {
                    locate: function(label, scope, config) {
                        return config.glance("target")
                    }
                }
            }
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    });

    it("should have beforeLocate", function() {
        let actualLabel;
        glance.addExtension({
            labels: {
                "custom-label": {
                    beforeLocate: function({label}) {
                        actualLabel = label;
                    }
                }
            }
        });

        glance("custom-label");

        return actualLabel.should.deep.equal("custom-label");
    });

    it("should have afterLocate", function() {
        let actualLabel;
        glance.addExtension({
            labels: {
                "custom-label": {
                    afterLocate: function({label}) {
                        actualLabel = label;
                    }
                }
            }
        });

        glance("custom-label");

        return actualLabel.should.deep.equal("custom-label");
    });
});

describe("Extensions: modifiers", function() {
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
            modifiers: {
                "every-other": {
                    filter: function(elements) {
                        let i = 0;
                        return elements.filter(e => ++i % 2);
                    }
                }
            }
        });

        return glance("item:every-other").should.deep.equal(dom.get("target-1", "target-2"));
    })
});


describe("Extensions: filter events", function() {
    let filterCalled = false;
    beforeEach(function() {
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

        glance("div")
        filterCalled.should.deep.equal(true);
    })

    it("should have afterFilter event", function() {
        glance.addExtension({
            afterFilter: function(elements) {
                filterCalled = true;

                return elements;
            }
        });

        glance("div")
        filterCalled.should.deep.equal(true);
    })
});

describe("Extensions: before and after all", function() {
    it("should have beforeAll event", function() {
        let beforeAllCalled = false;

        glance.addExtension({
            beforeAll: function({selector}) {
                beforeAllCalled = true;
            }
        });

        glance("div")
        beforeAllCalled.should.deep.equal(true);
    });

    it("should have afterAll event", function() {
        let afterAllCalled = false;

        glance.addExtension({
            afterAll: function() {
                afterAllCalled = true;
            }
        });

        glance("div")
        afterAllCalled.should.deep.equal(true);
    })
})
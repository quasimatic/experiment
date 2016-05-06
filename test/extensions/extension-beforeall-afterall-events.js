import glance from '../../src/selector';

describe("Extensions: before and after all", function() {
    it("should have beforeAll event", function() {
        let beforeAllCalled = false;

        glance.addExtension({
            beforeAll: function () {
                beforeAllCalled = true;
            }
        });

        glance("div");
        beforeAllCalled.should.deep.equal(true);
    });

    it("should have afterAll event", function() {
        let afterAllCalled = false;

        glance.addExtension({
            afterAll: function() {
                afterAllCalled = true;
            }
        });

        glance("div");
        afterAllCalled.should.deep.equal(true);
    });
});
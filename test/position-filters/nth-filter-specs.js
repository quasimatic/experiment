import nthFilter from '../../src/position-filters/nth-filter';

describe("Position filter: Nth", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should return all items if no position supplied", function () {
        nthFilter([1, 2, 3], null).should.deep.equal([1, 2, 3])
    });

    it("should start at 1", function () {
        nthFilter([1, 2, 3], 1).should.deep.equal([1])
    });
});
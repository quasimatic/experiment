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

    it("should give an error for out of range for 0", function () {
        try {
            nthFilter([1, 2, 3], 0)
            throw new Error("Didn't throw error")
        }
        catch (err) {
            err.message.should.equal("Position starts at 1")
        }
    });

    it("should give an error for out of range for less than 0", function () {
        try {
            nthFilter([1, 2, 3], -1)
            throw new Error("Didn't throw error")
        }
        catch (err) {
            err.message.should.equal("Position starts at 1")
        }

    });
    
    it("should give an error for out of range if the position is larger then the length", function () {
        try {
            nthFilter([1, 2, 3], 4)
            throw new Error("Didn't throw error")
        }
        catch (err) {
            err.message.should.equal("Position 4 out of range")
        }
    });
});
import locatorCollector from './locator-collector'

let testTarget = (label, details = {}) => {
    return {
        label: label,
        options: [],
        ...details
    }
}

describe("Locator Collector: Custom Labels", () => {
    it("should support a string", () => {
        locatorCollector.getLocators(testTarget("test"), [{
            labels: {
                "test": "foo"
            }
        }]).length.should.equal(1)
    });

    it("should support a array", () => {
        locatorCollector.getLocators(testTarget("test"), [{
            labels: {
                "test": ["foo","bar"]
            }
        }]).length.should.equal(2)
    });

    it("should support a function", () => {
        locatorCollector.getLocators(testTarget("test"), [{
            labels: {
                "test": () => {
                }
            }
        }]).length.should.equal(1)
    });

    it("should support a locator property as a string", () => {
        locatorCollector.getLocators(testTarget("test"), [{
            labels: {
                "test": {
                    locate: "foo"
                }
            }
        }]).length.should.equal(1)
    });

    it("should support a locator property as a function", () => {
        locatorCollector.getLocators(testTarget("test"), [{
            labels: {
                "test": {
                    locate: () => {
                    }
                }
            }
        }]).length.should.equal(1)
    });
});

describe("Locator Collector: Custom Options", () => {
    it("should support a locator property as a string", () => {
        locatorCollector.getLocators(testTarget("label", {options: ["test"]}), [{
            options: {
                "test": {
                    locate: "foo"
                }
            }
        }]).length.should.equal(1)
    });

    it("should support a locator property as a string", () => {
        locatorCollector.getLocators(testTarget("label", {options: ["test"]}), [{
            options: {
                "test": {
                    locate: ["foo", "bar"]
                }
            }
        }]).length.should.equal(2)
    });


    it("should support a locator property as a function", () => {
        locatorCollector.getLocators(testTarget("label", {options: ["test"]}), [{
            options: {
                "test": {
                    locate: () => {
                    }
                }
            }
        }]).length.should.equal(1)
    });
});
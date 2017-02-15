import LocatorCollector from './locator-collector'

let testTarget = (label, details = {}) => {
    return {
        label: label,
        options: [],
        ...details
    }
}

describe("Locator Collector: Custom Labels", () => {
    it("should support a string", () => {
        let locatorCollector = new LocatorCollector([{
            labels: {
                "test": "foo"
            }
        }]);
        locatorCollector.getLocators(testTarget("test")).length.should.equal(1)
    });

    it("should support a array", () => {
        let locatorCollector = new LocatorCollector([{
            labels: {
                "test": ["foo", "bar"]
            }
        }]);
        locatorCollector.getLocators(testTarget("test")).length.should.equal(2)
    });

    it("should support a function", () => {
        let locatorCollector = new LocatorCollector([{
            labels: {
                "test": () => {
                }
            }
        }])
        locatorCollector.getLocators(testTarget("test")).length.should.equal(1)
    });

    it("should support a locator property as a string", () => {
        let locatorCollector = new LocatorCollector([{
            labels: {
                "test": {
                    locate: "foo"
                }
            }
        }]);
        locatorCollector.getLocators(testTarget("test")).length.should.equal(1)
    });

    it("should support a locator property as a function", () => {
        let locatorCollector = new LocatorCollector([{
            labels: {
                "test": {
                    locate: () => {
                    }
                }
            }
        }]);
        locatorCollector.getLocators(testTarget("test")).length.should.equal(1)
    });
});

describe("Locator Collector: Custom Options", () => {
    it("should support a locator property as a string", () => {
        let locatorCollector = new LocatorCollector([{
            options: {
                "test": {
                    locate: "foo"
                }
            }
        }]);
        locatorCollector.getLocators(testTarget("label", {options: ["test"]})).length.should.equal(1)
    });

    it("should support a locator property as a string", () => {
        let locatorCollector = new LocatorCollector([{
            options: {
                "test": {
                    locate: ["foo", "bar"]
                }
            }
        }]);
        locatorCollector.getLocators(testTarget("label", {options: ["test"]})).length.should.equal(2)
    });


    it("should support a locator property as a function", () => {
        let locatorCollector = new LocatorCollector([{
            options: {
                "test": {
                    locate: () => {
                    }
                }
            }
        }]);
        locatorCollector.getLocators(testTarget("label", {options: ["test"]})).length.should.equal(1)
    });
});
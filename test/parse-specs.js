var parser = require('../src/parser');

describe("Parsing", function() {
    it("should get label", function() {
        parser.parse("label").should.deep.equal(
                 [
                    {
                        label: "label",
                        position: null,
                        modifiers: null
                    }
                ]
        );
    });

    it("should get index", function() {
        parser.parse("label#10").should.deep.equal( [
                {
                    label: "label",
                    position: 10,
                    modifiers: null
                }
            ]
        );
    });

    it("should support containers", function() {
        parser.parse("container>label").should.deep.equal([
                {
                    label: "container",
                    position: null,
                    modifiers: null
                },
                {
                    label: "label",
                    position: null,
                    modifiers: null
                }
            ]
        );
    });

    it("should support modifier", function() {
        parser.parse("label:text").should.deep.equal([
                {
                    label: "label",
                    position: null,
                    modifiers: ["text"]
                }
            ]
        );
    });

    it("should escape index character", function() {
        parser.parse("label\\#10").should.deep.equal([
                {
                    label: "label#10",
                    position: null,
                    modifiers: null
                }
            ]
        );
    });

    it("should escape container character", function() {
        parser.parse("label\\>test").should.deep.equal([
                {
                    label: "label>test",
                    position: null,
                    modifiers: null
                }
            ]
        );
    });

    it("should escape modifier character", function() {
        parser.parse("label\\:test").should.deep.equal([
                {
                    label: "label:test",
                    position: null,
                    modifiers: null
                }
            ]
        );
    });

    it("should escape the escape character", function() {
        parser.parse("label\\\\test").should.deep.equal([
                {
                    label: "label\\test",
                    position: null,
                    modifiers: null
                }
            ]
        );
    });
});
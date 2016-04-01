var parser = require('../src/parser');

describe("Parsing", function() {
    it("should get label", function() {
        parser.parse("label").should.deep.equal(
                 [
                    {
                        label: "label",
                        position: null,
                        modifiers: []
                    }
                ]
        );
    });

    it("should get index", function() {
        parser.parse("label#10").should.deep.equal( [
                {
                    label: "label",
                    position: 10,
                    modifiers: []
                }
            ]
        );
    });

    it("should support scopes", function() {
        parser.parse("scope>label").should.deep.equal([
                {
                    label: "scope",
                    position: null,
                    modifiers: []
                },
                {
                    label: "label",
                    position: null,
                    modifiers: []
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
                    modifiers: []
                }
            ]
        );
    });

    it("should escape scope character", function() {
        parser.parse("label\\>test").should.deep.equal([
                {
                    label: "label>test",
                    position: null,
                    modifiers: []
                }
            ]
        );
    });

    it("should escape modifier character", function() {
        parser.parse("label\\:test").should.deep.equal([
                {
                    label: "label:test",
                    position: null,
                    modifiers: []
                }
            ]
        );
    });

    it("should escape the escape character", function() {
        parser.parse("label\\\\test").should.deep.equal([
                {
                    label: "label\\test",
                    position: null,
                    modifiers: []
                }
            ]
        );
    });

    it("should support spaces before and after a label", function() {
        parser.parse(" label ").should.deep.equal([
            {
                label: "label",
                position: null,
                modifiers: []
            }
        ])
    })

    it("should support spaces before and after a label", function() {
        parser.parse(" label > label2 ").should.deep.equal([
            {
                label: "label",
                position: null,
                modifiers: []
            },
            {
                label: "label2",
                position: null,
                modifiers: []
            }
        ])
    })

    it("should support spaces before and after a label", function() {
        parser.parse(" label#1 ").should.deep.equal([
            {
                label: "label",
                position: 1,
                modifiers: []
            },
        ])
    })

    it("should support spaces before and after a label", function() {
        parser.parse(" label:modifier ").should.deep.equal([
            {
                label: "label",
                position: null,
                modifiers: [
                    "modifier"
                ]
            },
        ])
    })
});
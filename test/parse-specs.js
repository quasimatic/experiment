var parser = require('../src/parser');

describe("Parsing", function() {
    it("should get label", function() {
        parser.parse("label").should.deep.equal(
                 [
                    {
                        label: "label",
                        position: null,
                        modifiers: [],
                        scope: "",
                        path: "label"
                    }
                ]
        );
    });

    it("should get index", function() {
        parser.parse("label#10").should.deep.equal( [
                {
                    label: "label",
                    position: 10,
                    modifiers: [],
                    scope: "",
                    path: "label#10"
                }
            ]
        );
    });

    it("should support scopes", function() {
        parser.parse("scope>label").should.deep.equal([
                {
                    label: "scope",
                    position: null,
                    modifiers: [],
                    scope: "",
                    path: "scope"
                },
                {
                    label: "label",
                    position: null,
                    modifiers: [],
                    scope: "scope",
                    path: "scope>label"
                }
            ]
        );
    });

    it("should support modifier", function() {
        parser.parse("label:text").should.deep.equal([
                {
                    label: "label",
                    position: null,
                    modifiers: ["text"],
                    scope: "",
                    path: "label:text"
                }
            ]
        );
    });

    it("should escape index character", function() {
        parser.parse("label\\#10").should.deep.equal([
                {
                    label: "label#10",
                    position: null,
                    modifiers: [],
                    scope: "",
                    path: "label\\#10"
                }
            ]
        );
    });

    it("should escape scope character", function() {
        parser.parse("label\\>test").should.deep.equal([
                {
                    label: "label>test",
                    position: null,
                    modifiers: [],
                    scope: "",
                    path: "label\\>test"
                }
            ]
        );
    });

    it("should escape modifier character", function() {
        parser.parse("label\\:test").should.deep.equal([
                {
                    label: "label:test",
                    position: null,
                    modifiers: [],
                    scope: "",
                    path: "label\\:test"
                }
            ]
        );
    });

    it("should escape the escape character", function() {
        parser.parse("label\\\\test").should.deep.equal([
                {
                    label: "label\\test",
                    position: null,
                    modifiers: [],
                    scope: "",
                    path: "label\\\\test"
                }
            ]
        );
    });

    it("should support spaces before and after a label", function() {
        parser.parse(" label ").should.deep.equal([
            {
                label: "label",
                position: null,
                modifiers: [],
                scope: "",
                path: "label"
            }
        ])
    })

    it("should support spaces before and after a label", function() {
        parser.parse(" label > label2 ").should.deep.equal([
            {
                label: "label",
                position: null,
                modifiers: [],
                scope: "",
                path: "label"
            },
            {
                label: "label2",
                position: null,
                modifiers: [],
                scope: " label ",
                path: "label > label2"
            }
        ])
    })

    it("should support spaces before and after a label", function() {
        parser.parse(" label#1 ").should.deep.equal([
            {
                label: "label",
                position: 1,
                modifiers: [],
                scope: "",
                path: "label#1"
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
                ],
                scope: "",
                path: "label:modifier"
            },
        ])
    })
});
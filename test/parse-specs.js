var parser = require('../src/parser');

describe("Parsing", function() {
    it("should get label", function() {
        parser.parse("label").should.deep.equal(
                 [
                    {
                        label: "label",
                        position: null,
                        properties: [],
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
                    properties: [],
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
                    properties: [],
                    scope: "",
                    path: "scope"
                },
                {
                    label: "label",
                    position: null,
                    properties: [],
                    scope: "scope",
                    path: "scope>label"
                }
            ]
        );
    });

    it("should support property", function() {
        parser.parse("label:text").should.deep.equal([
                {
                    label: "label",
                    position: null,
                    properties: ["text"],
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
                    properties: [],
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
                    properties: [],
                    scope: "",
                    path: "label\\>test"
                }
            ]
        );
    });

    it("should escape property character", function() {
        parser.parse("label\\:test").should.deep.equal([
                {
                    label: "label:test",
                    position: null,
                    properties: [],
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
                    properties: [],
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
                properties: [],
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
                properties: [],
                scope: "",
                path: "label"
            },
            {
                label: "label2",
                position: null,
                properties: [],
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
                properties: [],
                scope: "",
                path: "label#1"
            },
        ])
    })

    it("should support spaces before and after a label", function() {
        parser.parse(" label:property ").should.deep.equal([
            {
                label: "label",
                position: null,
                properties: [
                    "property"
                ],
                scope: "",
                path: "label:property"
            },
        ])
    })
});
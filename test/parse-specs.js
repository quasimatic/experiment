var parser = require('../src/parser');

describe("Parsing", function () {
    it("should get label", function () {
        parser.parse("label").should.deep.equal(
            [{
                label: 'label',
                options: [],
                projections: [],
                scope: '',
                path: 'label',
                type: 'target'
            }]
        );
    });

    it("should get index", function () {
        parser.parse("label#10").should.deep.equal([
                {
                    label: 'label',
                    options: [10],
                    projections: [],
                    scope: '',
                    path: 'label#10',
                    type: 'target'
                }
            ]
        );
    });

    it("should support scopes", function () {
        parser.parse("scope>label").should.deep.equal([
            {
                label: 'scope',
                options: [],
                projections: [],
                scope: '',
                path: 'scope',
                type: 'scope'
            },
            {
                label: 'label',
                options: [],
                projections: [],
                scope: 'scope',
                path: 'scope>label',
                type: 'target'
            }
        ]);
    });

    it("should support option", function () {
        parser.parse("label:text").should.deep.equal([
                {
                    label: 'label',
                    options: [],
                    projections: ['text'],
                    scope: '',
                    path: 'label:text',
                    type: 'target'
                }
            ]
        );
    });

    it("should escape index character", function () {
        parser.parse("label\\#10").should.deep.equal([
            {
                label: 'label#10',
                options: [],
                projections: [],
                scope: '',
                path: 'label\\#10',
                type: 'target'
            }
        ]);
    });

    it("should escape scope character", function () {
        parser.parse("label\\>test").should.deep.equal([
            {
                label: 'label>test',
                options: [],
                projections: [],
                scope: '',
                path: 'label\\>test',
                type: 'target'
            }
        ]);
    });

    it("should escape option character", function () {
        parser.parse("label\\:test").should.deep.equal([
            {
                label: 'label:test',
                options: [],
                projections: [],
                scope: '',
                path: 'label\\:test',
                type: 'target'
            }
        ]);
    });

    it("should escape the escape character", function () {
        parser.parse("label\\\\test").should.deep.equal([
            {
                label: 'label\\test',
                options: [],
                projections: [],
                scope: '',
                path: 'label\\\\test',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label ").should.deep.equal([
            {
                label: 'label',
                options: [],
                projections: [],
                scope: '',
                path: 'label',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label > label2 ").should.deep.equal([
            {
                label: 'label',
                options: [],
                projections: [],
                scope: '',
                path: 'label',
                type: 'scope'
            },
            {
                label: 'label2',
                options: [],
                projections: [],
                scope: 'label',
                path: 'label > label2',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label#1 ").should.deep.equal([
            {
                label: 'label',
                options: [1],
                projections: [],
                scope: '',
                path: 'label#1',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label:option ").should.deep.equal([
            {
                label: 'label',
                options: [],
                projections: ['option'],
                scope: '',
                path: 'label:option',
                type: 'target'
            }
        ]);
    });

    it("should support intersecting labels", function () {
        parser.parse(" label 1^label 2 ").should.deep.equal([
            {
                label: 'label 1',
                options: [],
                projections: [],
                scope: '',
                path: 'label 1',
                type: 'intersect'
            },
            {
                label: 'label 2',
                options: [],
                projections: [],
                scope: 'label 1',
                path: 'label 1^label 2',
                type: 'target'
            }
        ]);
    });
});
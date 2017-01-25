var parser = require('../src/parser');

describe("Parsing", function () {
    it("should get label", function () {
        parser.parse("label").should.deep.equal(
            [{
                label: 'label',
                options: [],
                transforms: [],
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
                    transforms: [],
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
                transforms: [],
                scope: '',
                path: 'scope',
                type: 'scope'
            },
            {
                label: 'label',
                options: [],
                transforms: [],
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
                    transforms: ['text'],
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
                transforms: [],
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
                transforms: [],
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
                transforms: [],
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
                transforms: [],
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
                transforms: [],
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
                transforms: [],
                scope: '',
                path: 'label',
                type: 'scope'
            },
            {
                label: 'label2',
                options: [],
                transforms: [],
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
                transforms: [],
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
                transforms: ['option'],
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
                transforms: [],
                scope: '',
                path: 'label 1',
                type: 'intersect'
            },
            {
                label: 'label 2',
                options: [],
                transforms: [],
                scope: 'label 1',
                path: 'label 1^label 2',
                type: 'target'
            }
        ]);
    });
});
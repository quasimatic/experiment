var parser = require('../src/parser');

describe("Parsing", function () {
    it("should get label", function () {
        parser.parse("label").should.deep.equal(
            [{
                label: 'label',
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label',
                type: 'target'
            }]
        );
    });

    it("should get index", function () {
        parser.parse("label#10").should.deep.equal([
                {
                    label: 'label',
                    properties: [10],
                    transforms: [],
                    scope: '',
                    scopeIndex: 0,
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
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'scope',
                type: 'scope'
            },
            {
                label: 'label',
                properties: [],
                transforms: [],
                scope: 'scope',
                scopeIndex: 1,
                path: 'scope>label',
                type: 'target'
            }
        ]);
    });

    it("should support property", function () {
        parser.parse("label:text").should.deep.equal([
                {
                    label: 'label',
                    properties: [],
                    transforms: ['text'],
                    scope: '',
                    scopeIndex: 0,
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
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label\\#10',
                type: 'target'
            }
        ]);
    });

    it("should escape scope character", function () {
        parser.parse("label\\>test").should.deep.equal([
            {
                label: 'label>test',
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label\\>test',
                type: 'target'
            }
        ]);
    });

    it("should escape property character", function () {
        parser.parse("label\\:test").should.deep.equal([
            {
                label: 'label:test',
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label\\:test',
                type: 'target'
            }
        ]);
    });

    it("should escape the escape character", function () {
        parser.parse("label\\\\test").should.deep.equal([
            {
                label: 'label\\test',
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label\\\\test',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label ").should.deep.equal([
            {
                label: 'label',
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label > label2 ").should.deep.equal([
            {
                label: 'label',
                properties: [],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label',
                type: 'scope'
            },
            {
                label: 'label2',
                properties: [],
                transforms: [],
                scope: 'label',
                scopeIndex: 1,
                path: 'label > label2',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label#1 ").should.deep.equal([
            {
                label: 'label',
                properties: [1],
                transforms: [],
                scope: '',
                scopeIndex: 0,
                path: 'label#1',
                type: 'target'
            }
        ]);
    });

    it("should support spaces before and after a label", function () {
        parser.parse(" label:property ").should.deep.equal([
            {
                label: 'label',
                properties: [],
                transforms: ['property'],
                scope: '',
                scopeIndex: 0,
                path: 'label:property',
                type: 'target'
            }
        ]);
    });

    // it("should support intersecting labels", function () {
    //     parser.parse(" label 1^label 2 ").should.deep.equal([
    //
    //         {
    //             label: 'label 1',
    //             position: null,
    //             properties: [],
    //             scope: '',
    //             scopeIndex: 0,
    //             path: 'label 1'
    //         },
    //         {
    //             label: 'label 2',
    //             position: null,
    //             properties: [],
    //             scope: '',
    //             scopeIndex: 0,
    //             path: 'label 2'
    //         }
    //     ]);
    // });
});
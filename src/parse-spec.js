import parser from './parser';

describe("Parsing", function () {
    it("should get label", function () {
        parser.parse("label").should.deep.equal(
            [{
                label: 'label',
                options: [],
                projections: [],
                scope: '',
                path: 'label',
                type: 'subject'
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
                    type: 'subject'
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
                type: 'subject'
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
                    type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
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
                type: 'subject'
            }
        ]);
    });
});

describe("Glace Parser: Syntax Errors", () => {
    it("should not throw an error for an empty string", () => {
        parser.parse("").should.deep.equal([]);
    });

    it("should throw an error for >>", () => {
        expect(() => parser.parse("aaa >>")).to.throw('Expected "\\\\" or end of input but ">" found.');
    });
});
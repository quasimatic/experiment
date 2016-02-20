var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.Should();

parser = require('../lib/glance-parser');

describe("Parsing", function() {
    it("should get label", function() {
        parser.parse("label").should.deep.equal({
                containers: [
                    {
                        label: "label",
                        position: null,
                        modifier: null
                    }
                ]
            }
        );
    });

    it("should get index", function() {
        parser.parse("label#10").should.deep.equal({
            containers: [

                {
                    label: "label",
                    position: 10,
                    modifier: null
                }
            ]
        });
    });

    it("should support containers", function() {
        parser.parse("container>label").should.deep.equal({
            containers: [
                {
                    label: "container",
                    position: null,
                    modifier: null
                },
                {
                    label: "label",
                    position: null,
                    modifier: null
                }
            ]
        });
    });

    it("should support modifier", function() {
        parser.parse("label:text").should.deep.equal({
            containers: [
                {
                    label: "label",
                    position: null,
                    modifier: "text"
                }
            ]
        });
    });

    it("should escape index character", function() {
        parser.parse("label\\#10").should.deep.equal({
            containers: [
                {
                    label: "label#10",
                    position: null,
                    modifier: null
                }
            ]
        });
    });

    it("should escape container character", function() {
        parser.parse("label\\>test").should.deep.equal({
            containers: [
                {
                    label: "label>test",
                    position: null,
                    modifier: null
                }
            ]
        });
    });

    it("should escape modifier character", function() {
        parser.parse("label\\:test").should.deep.equal({
            containers: [
                {
                    label: "label:test",
                    position: null,
                    modifier: null
                }
            ]
        });
    });

    it("should escape the escape character", function() {
        parser.parse("label\\\\test").should.deep.equal({
            containers: [
                {
                    label: "label\\test",
                    position: null,
                    modifier: null
                }
            ]
        });
    });
});
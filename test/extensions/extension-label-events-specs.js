import glance from '../../src/selector';
import dom from "../dom";

describe("Extensions: beforeLocateEvent", function () {
    let receivedData = {};

    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div className="wrapper">
                <div className="item"></div>
            </div>
        );

        glance.addExtension({
            beforeLocate: function (data) {
                receivedData = data;
            }
        });

        glance("wrapper > item");
    });

    it("should have a config", function () {
        receivedData.should.have.property('target')
        receivedData.should.have.property('containerElement')
    });
});

describe("Extensions: afterLocateEvent", function () {
    let receivedData = {};

    before(function () {
        document.body.innerHTML = "";
        dom.render(
            <div className="wrapper">
                <div className="item"></div>
            </div>
        );

        glance.addExtension({
            afterLocate: function (data) {
                receivedData = data;
            }
        });

        glance("wrapper > item");
    });

    it("should have a config", function () {
        receivedData.should.have.property('target')
        receivedData.should.have.property('containerElement')
    });
});
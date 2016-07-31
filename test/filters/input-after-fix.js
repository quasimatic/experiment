import glance from '../../src/selector';
import dom from "../dom"

describe("Input after", function () {
    beforeEach(function () {
        document.body.innerHTML = "";
    });

    it("should get input next to label", function () {
        dom.render(
            <div>
                <div>
                    <label>name</label>
                    <input id="target-1"/>
                    <label>another</label>
                    <input />
                </div>
            </div>
        );

        return glance("name > input").should.deep.equal(dom.get("target-1"));
    });

    it("should limit to next sibling", function () {
        dom.render(
            <div>
                <div>name</div>
                <div>something else</div>
                <input/>

                <div>
                    <label>name</label>
                    <input id="target-1"/>
                    <label>another</label>
                    <input />
                </div>
                <div>
                    <label>name</label>
                    <input id="target-2"/>
                    <label >another</label>
                    <input />
                </div>
            </div>
        );

        return glance("name > input").should.deep.equal(dom.get("target-1", "target-2"));
    });

    // it("should not apply to input next to input", function () {
    //     dom.render(
    //         <div>
    //                 <input id="target-1" class="name"/>
    //                 <input id="target-2" class="class2"/>
    //         </div>
    //     );
    //
    //     return glance("name > input").should.deep.equal(dom.get("target-1", "target-2"));
    // });
});
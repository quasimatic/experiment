import glance from '../src/selector';
import dom from "./dom"

describe("Overrides", function() {
    beforeEach(function() {
        document.body.innerHTML = "";
    });

    it("should find text in select option", function() {
        dom.render(
            <div>
                <div id="target"></div>
            </div>
        )

        glance.addOverrides({
            labels: {
                "custom-label": {
                    locate: function(){
                        return document.getElementById("target")
                    }
                }
            },

            modifiers: {
                "enabled":{}
            },

            "":[
                
            ]
        });

        return glance("custom-label").should.deep.equal(dom.get("target"));
    })
});
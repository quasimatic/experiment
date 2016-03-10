import glance from '../src/glance';

describe("Glance", function() {
    it("selector", function() {
        var newDiv = document.createElement('div');
        newDiv.setAttribute("id", "foo")
        var newContent = document.createTextNode("Hi there and greetings!");
        newDiv.appendChild(newContent);
        document.body.appendChild(newDiv)

        console.log('foo')
        console.log(glance("foo"))
    });
});
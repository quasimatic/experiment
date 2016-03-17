export default {
    create(type, text, options) {
        text = text || "";
        options = options || {};

        options.parent = options.parent || document.body;

        var div = document.createElement(type);
        div.appendChild(document.createTextNode(text));

        Object.keys(options).forEach(function (key) {
            if (key != "parent")
                div.setAttribute(key, options[key]);
        });

        options.parent.appendChild(div);

        return div;
    },

    createDiv(text, options)
    {
        return this.create("div", text, options);
    },

    createText(text, options) {
        options.parent = options.parent || document.body;

        var textNode = document.createTextNode(text);
        options.parent.appendChild(textNode);

        return textNode;
    }
}
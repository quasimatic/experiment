export default {
    create(type, text, options) {
        options = options || {};

        var div = document.createElement(type);
        div.appendChild(document.createTextNode(text));


        Object.keys(options).forEach(function(key){
            div.setAttribute(key, options[key]);
        });

        document.body.appendChild(div);

        return div;
    },

    createDiv(text, options)
    {
        return this.create("div", text, options);
    }
}
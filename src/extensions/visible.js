export default {
    properties: {
        "visible": {
            filter: function visible(elements, data, resultHandler) {
                return resultHandler(null, elements.filter(e => e.tagName.toLowerCase() == "option" || e.offsetParent));
            }
        }
    }
};
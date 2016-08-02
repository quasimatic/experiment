export default {
    properties: {
        "visible": {
            filter: function visible({elements}, resultHandler) {
                return browserExecute(function (elements, handler) {
                    return handler(null, elements.filter(e => e.tagName.toLowerCase() == "option" || e.offsetParent))
                }, elements, resultHandler);
            }
        }
    }
};
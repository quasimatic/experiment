export default {
    properties: {
        "visible": {
            filter: function visible({elements}, resultHandler) {
                return browserExecute(function (elements, handler) {
                    return handler(null, elements.filter(e => {
                        if(e.tagName.toLowerCase() == "option" || e.offsetParent)
                            return true;
                        else {
                            var style = window.getComputedStyle(e);
                            return (style.display != 'none');
                        }
                    }));
                }, elements, resultHandler);
            }
        }
    }
};
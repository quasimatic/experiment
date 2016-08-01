export default {
    properties: {
        "inputafter": {
            filter: function visible({elements, scopeElement}, resultHandler) {
                let siblings = elements.filter(function(e) {
                    return scopeElement && scopeElement.nextElementSibling == e;
                });

                return resultHandler(null, siblings.length == 0 ? elements : siblings);
            }
        }
    }
};
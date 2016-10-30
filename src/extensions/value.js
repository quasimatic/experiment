import log from "../log"
/*
 Searching the dom by xpath or css for value only gets the default. Inputs dynamically set don't update the dom which
 xpath and css won't find. The method is used to get search those dynamic values as well.
 */
export default {
    properties: {
        "value": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching in value:", label);

                    return browserExecute(function (scope, l, handler) {
                        let results = scope.querySelectorAll("button,input,option,param");

                        var elements = Array.prototype.slice.apply(results);

                        return handler(null, elements.filter(function (input) {
                            return input.value && input.value.toLowerCase().indexOf(l.toLowerCase()) != -1;
                        }));
                    }, scopeElement, label, resultHandler);
                }
                catch (error) {
                    return resultHandler(error, []);
                }
            }
        }
    }
}
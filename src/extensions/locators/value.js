import log from "../../log"
import browserExecute from '../../browser-execute'

/*
 Searching the dom by xpath or css for value only gets the default. Inputs dynamically set don't update the dom which
 xpath and css won't find. The method is used to get search those dynamic values as well.
 */
export default {
    options: {
        "value": {
            locate: function ({label, containerElement}, resultHandler = (err, result) => result) {
                log.debug("Searching in value:", label);

                return browserExecute(function (scope, l, handler) {
                    let results = scope.querySelectorAll("button,input,option,param");

                    var elements = Array.prototype.slice.apply(results);

                    return handler(null, elements.filter(function (input) {
                        return input.value && input.value.toLowerCase().indexOf(l.toLowerCase()) != -1;
                    }));
                }, containerElement, label, resultHandler);
            }
        }
    }
}
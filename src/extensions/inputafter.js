import log from "../log"
import browserExecute from '../browser-execute'

export default {
    options: {
        "inputafter": {
            filter: function inputafter({elements, scopeElements}, resultHandler) {
                log.debug("Filtering for sibling input next to scope");

                return browserExecute(function (elements, scopeElements, handler) {
                    let siblings = elements.filter(function (e) {
                        if (e.nodeName.toLowerCase() == "input") {
                            return e.previousElementSibling && e.previousElementSibling.nodeName.toLowerCase() != "input" && scopeElements.indexOf(e.previousElementSibling) != -1;
                        }

                        return false;
                    });
                    return handler(null, siblings.length == 0 ? elements : siblings);
                }, elements, scopeElements, resultHandler);
            }
        }
    }
};
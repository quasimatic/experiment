import log from "../../log"
import browserExecute from '../../browser-execute'
import defaultHandler from '../../utils/default-result-handler';

export default {
    options: {
        "input-after": {
            filter: function inputafter({elements, scopeElements}, resultHandler = defaultHandler) {
                log.debug("Filtering for sibling input next to scope");

                return browserExecute(function (eee, scopeElements, handler) {
                    let siblings = eee.filter(function (e) {
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
import log from '../../log'
import defaultHandler from '../../utils/default-result-handler'
import browserExecute from '../../browser-execute'

export default {
    options: {
        "leaf-node-target": {
            filter: function visible({target, elements}, resultHandler = defaultHandler) {
                log.debug("Filtering for leaf node targets");

                if (target.type != "target") return resultHandler(null, elements);

                return browserExecute(function (elements, handler) {
                    var filteredElements = elements.filter(function (e) {
                        return !e.childNodes
                            || e.childNodes.length == 0
                            || [].slice.call(e.childNodes).every(function (c) {
                                return c.nodeType == Node.TEXT_NODE
                            })
                    });

                    if (filteredElements.length == 0) {
                        return handler(null, elements);
                    }

                    return handler(null, filteredElements);
                }, elements, resultHandler);
            }
        }
    }
};
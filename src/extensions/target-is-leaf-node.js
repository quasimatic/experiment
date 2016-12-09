import log from "../log"

export default {
    options: {
        "target-is-leaf-node": {
            filter: function visible({target, elements} , resultHandler) {
                log.debug("Filtering for leaf node targets");

                if (target.type != "target") return resultHandler(null, elements);

                return browserExecute(function (elements, handler) {
                    try {
                        var filteredElements = elements.filter(function (e) {
                            return !e.childNodes
                                || e.childNodes.length == 0
                                || [].slice.call(e.childNodes).every(function (c) {
                                    return c.nodeType == Node.TEXT_NODE
                                })
                        });

                        if(filteredElements.length == 0) {
                            return handler(null, elements);
                        }

                        return handler(null, filteredElements);
                    }
                    catch (err) {
                        return handler(err, []);
                    }
                }, elements, resultHandler);
            }
        }
    }
};
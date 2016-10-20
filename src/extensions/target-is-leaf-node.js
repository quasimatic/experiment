export default {
    properties: {
        "target-is-leaf-node": {
            filter: function visible({
                target, elements, log = {
                debug: () => {
                }
            }
            }, resultHandler) {
                if (target.type != "target") return resultHandler(null, elements);

                log.debug("Filtering target is a leaf node");
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
export default {
    properties: {
        "shortestscopeandcontainerpath": {
            filter: function closestdom({elements, scopeElements, target}, resultHandler) {
                return browserExecute(function (elements, scopeElements, scopeIndex, handler) {
                    try {
                        if(scopeIndex == 0) return handler(null, elements);

                        scopeElements.forEach(function (v) {
                            var p = v;
                            var i = 0;

                            while (p != null && p.outerHTML != null) {
                                if (!p.distantToScope || i < p.distantToScope) {
                                    p.distantToScope = i;
                                }

                                ++i;

                                p = p.parentNode;
                            }
                        });

                        var closestLevel = -1;
                        var closestElements = [];

                        elements.forEach(function (element) {
                            var parent = element;

                            while ((closestLevel == -1 || !parent.distantToScope || parent.distantToScope  <= closestLevel) && parent != null && parent.outerHTML != null) {
                                if (parent.distantToScope || parent.distantToScope === 0) {
                                     if (parent.distantToScope < closestLevel) {
                                         closestElements = [];
                                     }

                                    closestLevel = parent.distantToScope;
                                    closestElements.push(element);
                                    break;
                                }

                                parent = parent.parentNode;
                            }
                        });

                        return handler(null, closestElements);
                    }
                    catch (err) {
                        return handler(err, []);
                    }
                }, elements, scopeElements, target.scopeIndex, resultHandler);
            }
        }
    }
};
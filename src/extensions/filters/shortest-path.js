import log from "../../log"
import browserExecute from '../../browser-execute'

export default {
    options: {
        "shortest-path": {
            filter: function closestdom({elements, scopeElements, target}, resultHandler) {
                log.debug("Filtering for shortest scope and target");

                return browserExecute(function (elements, scopeElements, scopeIndex, handler) {
                    try {
                        var elementsForDistance = [];
                        var distanceToScopeLookup = {};

                        function addToLookup(element, distance) {
                            elementsForDistance.push(element);
                            var i = elementsForDistance.indexOf(element);
                            distanceToScopeLookup[i] = distance;
                        }

                        function lookup(element) {
                            var i = elementsForDistance.indexOf(element);
                            if(i == -1) return null;

                            return distanceToScopeLookup[i];
                        }


                        if (scopeIndex == 0) return handler(null, elements);

                        scopeElements.forEach(function (v) {
                            var p = v;
                            var i = 0;

                            while (p != null && p.outerHTML != null) {
                                var distanceToScope = lookup(p);

                                if (!distanceToScope || i < distanceToScope) {
                                    addToLookup(p, i);
                                }

                                ++i;

                                p = p.parentNode;
                            }
                        });

                        var closestLevel = -1;
                        var closestElements = [];

                        elements.forEach(function (element) {
                            var parent = element;

                            var distanceToScope = lookup(parent);

                            while ((closestLevel == -1 || !distanceToScope || distanceToScope <= closestLevel) && parent != null && parent.outerHTML != null) {
                                if (distanceToScope || distanceToScope === 0) {
                                    if (distanceToScope < closestLevel) {
                                        closestElements = [];
                                    }

                                    closestLevel = distanceToScope;
                                    closestElements.push(element);
                                    break;
                                }

                                parent = parent.parentNode;
                                distanceToScope = lookup(parent);
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
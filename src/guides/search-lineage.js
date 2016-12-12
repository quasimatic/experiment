import Extensions from "../utils/extensions";
import Locator from "./locator";
import Filter from "./filter";
import log from "../log";
import browserExecute from '../browser-execute'
import {reduce, unique} from "../utils/array-utils";

function filterIntersectingElements(intersectElements, scopeElement, result, located, reduceeCallback) {
    log.debug("Finding intersections");

    function resultHandler(err, located) {
        if (err) {
            return reduceeCallback(err, []);
        }
        result.push({scopeElement, elements: located});
        return reduceeCallback(err, result);
    }

    if (intersectElements) {

        return browserExecute(function (located, previous, handler) {
            return handler(null, located.filter(function (e) {
                return previous.indexOf(e) != -1;
            }));
        }, located, intersectElements, function (err, result) {
            log.debug("Intersection count:", result.length);
            return resultHandler(err, result);
        });
    }

    return resultHandler(null, located);
}

export default class SearchLineage {
    static traverseScopes(data, resultHandler) {
        let {
            elements,
            scopes,
            target,
            intersectElements
        } = data;

        let processLevel = (result, scopeElement, reduceeCallback) => {
            Extensions.beforeScopeEvent({...data, scopeElement});

            return Locator.locate({...data, scopeElement}, (err, located) => {
                return filterIntersectingElements(intersectElements, scopeElement, result, located, reduceeCallback);
            });
        };

        return reduce(elements, [], processLevel, (err, locatedTargets) => {
            if (err) {
                return resultHandler(err, []);
            }

                var targetInfo = locatedTargets.reduce((result, info) => {
                    result.elements = result.elements.concat(info.elements);
                    result.scopeElements.push(info.scopeElement);
                    return result;
                }, {elements: [], scopeElements: []});

                return unique(targetInfo.elements, (err, uniqueTargets) => {
                    targetInfo.elements = uniqueTargets;

                    return Filter.filter({...data, ...targetInfo}, (err, filteredElements) => {
                        if (err) {
                            return resultHandler(err, []);
                        }

                        Extensions.afterScopeEvent({...data, elements: filteredElements});

                        if (target.type == "target") {
                            return resultHandler(err, filteredElements);
                        }
                        else {
                            if (target.type == "intersect") {
                                return SearchLineage.traverseScopes({
                                    ...data,
                                    intersectElements: filteredElements,
                                    elements: filteredElements,
                                    target: scopes[target.scopeIndex + 1]
                                }, resultHandler);
                            }
                            else {
                                return SearchLineage.traverseScopes({
                                    ...data,
                                    intersectElements: null,
                                    scopeElements: filteredElements,
                                    elements: filteredElements,
                                    target: scopes[target.scopeIndex + 1]
                                }, resultHandler);
                            }
                        }
                    });
            });
        });
    }
}


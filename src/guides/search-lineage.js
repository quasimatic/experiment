import Extensions from "../utils/extensions";
import Locator from "./locator";
import Filter from "./filter";
import {reduce, unique} from "../utils/array-utils";
import locateIntersections from "./locate-intersections";

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
            function resultHandler(err, located) {
                if (err) {
                    return reduceeCallback(err, []);
                }
                result.push({scopeElement, elements: located});
                return reduceeCallback(err, result);
            }

            if (intersectElements) {
                return locateIntersections(data, intersectElements, scopeElement, result, resultHandler);
            }
            else {
                return Locator.locate({...data, scopeElement}, resultHandler)
            }
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

                    if (target.type == "intersect") {
                        return SearchLineage.traverseScopes({
                            ...data,
                            intersectElements: filteredElements,
                            elements: filteredElements,
                            target: scopes[target.scopeIndex + 1]
                        }, resultHandler);
                    }

                    return SearchLineage.traverseScopes({
                        ...data,
                        intersectElements: null,
                        scopeElements: filteredElements,
                        elements: filteredElements,
                        target: scopes[target.scopeIndex + 1]
                    }, resultHandler);
                });
            });
        });
    }
}


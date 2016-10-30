import Extensions from "../utils/extensions";
import Locator from "./locator";
import Filter from "./filter";

import {reduce, unique} from "../utils/array-utils";

export default class SearchLineage {
    search(data, callback = (err, result) => result) {
        let {scopes, scopeElement, config = {}} = data;
        config.extensions = config.extensions || [];

        data = {
            ...data,
            extensions: config.extensions
        };

        return SearchLineage.traverseScopes({
            ...data,
            elements: [scopeElement],
            target: scopes[0],
            scopeElements: []
        }, callback);
    }

    static traverseScopes(data, resultHandler) {
        let {
            elements,
            scopes,
            target
        } = data;

        let processLevel = (result, scopeElement, reduceeCallback) => {
            var tempData = {
                ...data,
                scopeElement
            };

            Extensions.beforeScopeEvent(tempData);

            function resultHandler(err, located) {
                if (err) {
                    return reduceeCallback(err, []);
                }
                result.push({scopeElement: scopeElement, elements: located});
                return reduceeCallback(err, result);
            }

            return Locator.locate(tempData, (err, located) => {
                if (tempData.intersectElements) {
                    return browserExecute(function (located, previous, handler) {
                        return handler(null, located.filter(function (e) {
                            return previous.indexOf(e) != -1;
                        }));
                    }, located, tempData.intersectElements, resultHandler);
                }

                return resultHandler(null, located);
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
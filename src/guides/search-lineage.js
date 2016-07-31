import Extensions from "../utils/extensions";
import Locator from "./locator";
import Filter from "./filter";
import Positional from "./positional";

import {reduce, unique} from "../utils/array-utils";

export default class SearchLineage {
    search({targets, scope, config}, callback) {
        callback = callback || function (err, result) {
                return result;
            };

        config = config || {};
        config.extensions = config.extensions || [];

        let data = {
            target: targets[0],
            config,
            targets,
            scope,
            extensions: config.extensions || []
        };

        return this.processLevel(data, (err, elements) => {
            return unique(elements, (err, uniqueElements)=> {
                data = {...data, elements: uniqueElements};

                let positionalElements = Positional.filter(data);
                if (targets.length > 1) {
                    Extensions.afterScopeEvent(data);

                    return SearchLineage.traverseScopes({
                        ...data,
                        elements: positionalElements,
                        scopeIndex: 1,
                        target: data.targets[1]
                    }, callback);
                }
                else {
                    return callback(err, positionalElements);
                }
            })
        });
    }

    processLevel(data, resultHandler) {
        Extensions.beforeScopeEvent(data);

        return Locator.locate(data, (err, elements) => {
            return Filter.filter({...data, elements}, (err, filteredElements) => resultHandler(null, filteredElements));
        });
    }

    static traverseScopes(data, resultHandler) {
        let {
            target,
            elements,
            targets
        } = data;

        let process = (filtered, scope, reduceeCallback) => {
            return new SearchLineage().processLevel({
                ...data,
                scope
            }, (err, foundItems) => reduceeCallback(err, filtered.concat(foundItems)));
        };

        return reduce(elements, [], process, (err, newTargets) => {
            return unique(newTargets, (err, uniqueTargets)=> {
                data = {...data, elements: uniqueTargets};

                let positionalElements = Positional.filter(data);

                Extensions.afterScopeEvent(data);

                if (SearchLineage.isLastLabel(targets, target)) {
                    return resultHandler(err, positionalElements);
                }
                else {
                    return SearchLineage.traverseScopes({
                        ...data,
                        elements: positionalElements,
                        target: targets[target.scopeIndex + 1]
                    }, resultHandler);
                }
            });
        });
    }

    static isLastLabel(targets, {scopeIndex}) {
        return scopeIndex + 1 === targets.length;
    }
}
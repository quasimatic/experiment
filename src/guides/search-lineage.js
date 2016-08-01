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
            elements: [scope],
            target: targets[0],
            config,
            targets,
            scope,
            extensions: config.extensions
        };

        return SearchLineage.traverseScopes(data, callback);
    }

    static processLevel(data, resultHandler) {
        Extensions.beforeScopeEvent(data);

        return Locator.locate(data, (err, elements) => Filter.filter({...data, elements}, resultHandler));
    }

    static traverseScopes(data, resultHandler) {
        let {
            target,
            elements,
            targets
        } = data;

        let processLevel = (result, scope, reduceeCallback) => {
            return SearchLineage.processLevel({
                ...data,
                scope
            }, (err, foundItems) => reduceeCallback(err, result.concat(foundItems)));
        };

        return reduce(elements, [], processLevel, (err, newTargets) => {
            return unique(newTargets, (err, uniqueTargets) => {
                let positionalElements = Positional.filter({...data, elements: uniqueTargets});

                Extensions.afterScopeEvent({...data, elements: positionalElements});

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
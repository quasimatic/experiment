import Extensions from "../utils/extensions";
import Locator from "./locator";
import Filter from "./filter";
import Positional from "./positional";

import {reduce, unique} from "../utils/array-utils";

export default class SearchLineage {
    constructor(config) {
        this.config = config;
        this.config.extensions = config.extensions || [];
        this.extensions = config.extensions || [];
    }

    search(targets, scope, callback) {
        callback = callback || function (err, result) {
                return result;
            };

        return this.processLevel(targets, scope, 0, (err, elements) => {
            let target = targets[0]

            return unique(elements, (err, uniqueElements)=>{
                let positionalElements = Positional.filter(uniqueElements, target, this.extensions, {target, scope});
                if (targets.length > 1) {
                    Extensions.afterScopeEvent(this.extensions, {targets, scope});
                    return SearchLineage.traverseScopes(positionalElements, targets, 1, scope, this.config, callback);
                }
                else {
                    return callback(err, positionalElements);
                }
            })
        });
    }

    processLevel(targets, scope, labelIndex, resultHandler) {
        let target = targets[labelIndex];

        Extensions.beforeScopeEvent(this.extensions, {targets, scope});

        return Locator.locate(target, scope, this.extensions, this.config, (err, locatedElements) => {
            return Filter.filter(target, locatedElements, scope, this.extensions, this.config, (err, filteredElements) => {
                return resultHandler(null, filteredElements);
            });
        });
    }

    static traverseScopes(filteredElements, targets, labelIndex, scope, config, resultHandler) {
        let process = (filtered, childContainer, reduceeCallback) => {
            return new SearchLineage(config).processLevel(targets, childContainer, labelIndex, (err, foundItems) => reduceeCallback(err, filtered.concat(foundItems)));
        };

        return reduce(filteredElements, [], process, (err, newTargets) => {
            let target = targets[labelIndex];
            return unique(newTargets, (err, uniqueTargets)=> {
                let positionalElements = Positional.filter(uniqueTargets, target, config.extensions, {
                    target,
                    scope
                });
                Extensions.afterScopeEvent(config.extensions, {targets, scope});
                if (SearchLineage.isLastLabel(targets, labelIndex)) {
                    return resultHandler(err, positionalElements)
                }
                else
                    return SearchLineage.traverseScopes(positionalElements, targets, labelIndex + 1, scope, config, resultHandler);
            });
        });
    }

    static isLastLabel(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
}
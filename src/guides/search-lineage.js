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
        let labelIndex = 0;

        return this.process(targets, scope, labelIndex, function (err, elements) {
            return callback(err, elements);
        });
    }

    process(targets, scope, labelIndex, resultHandler) {
        let target = targets[labelIndex];

        Extensions.beforeScopeEvent(this.extensions, {targets, scope});

        return Locator.locate(target, scope, this.extensions, this.config, (err, locatedElements) => {
            return Filter.filter(target, locatedElements, scope, this.extensions, this.config, (err, filteredElements) => {
                let positionalElements = Positional.filter(filteredElements, target, this.extensions, {target, scope});

                Extensions.afterScopeEvent(this.extensions, {targets, scope});

                if (SearchLineage.isLastLabel(targets, labelIndex)) {
                    return resultHandler(null, positionalElements);
                }
                else {
                    return SearchLineage.traverseScopes(positionalElements, targets, labelIndex, this.config, resultHandler);
                }
            });
        });
    }

    static traverseScopes(filteredElements, targets, labelIndex, config, resultHandler) {
        let process = (filtered, childContainer, reduceeCallback) => {
            return new SearchLineage(config).process(targets, childContainer, labelIndex + 1, (err, foundItems) => reduceeCallback(err, filtered.concat(foundItems)));
        };

        return reduce(filteredElements, [], process, (err, newTargets) => resultHandler(err, unique(newTargets)));
    }

    static isLastLabel(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
}
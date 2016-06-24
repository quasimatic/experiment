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
        callback = callback || function (result) {
                return result;
            };
        let labelIndex = 0;

        return this.process(targets, scope, labelIndex, function (elements) {
            return callback(elements);
        });
    }

    process(targets, scope, labelIndex, callback) {
        let target = targets[labelIndex];

        Extensions.beforeScopeEvent(this.extensions, {targets, scope});

        return Locator.locate(target, scope, this.extensions, this.config, (locatedElements) => {
            return Filter.filter(target, locatedElements, scope, this.extensions, this.config, (filteredElements) => {
                let positionalElements = Positional.filter(filteredElements, target, this.extensions, {target, scope});

                Extensions.afterScopeEvent(this.extensions, {targets, scope});

                if (SearchLineage.isLastLabel(targets, labelIndex)) {
                    return callback(positionalElements);
                }
                else {
                    return SearchLineage.traverseScopes(positionalElements, targets, labelIndex, this.config, callback);
                }
            });
        });
    }

    static traverseScopes(filteredElements, targets, labelIndex, config, callback) {
        let process = (filtered, childContainer, reduceeCallback) => {
            return new SearchLineage(config).process(targets, childContainer, labelIndex + 1, foundItems => reduceeCallback(filtered.concat(foundItems)));
        };

        return reduce(filteredElements, [], process, (newTargets) => callback(unique(newTargets)));
    }

    static isLastLabel(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
}
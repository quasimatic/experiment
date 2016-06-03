import visible from "../filters/visible";
import Extensions from "../utils/extensions";
import unique from "../utils/unique";
import Locator from "./locator";
import Filter from "./filter";
import Positional from "./positional";

export default class SearchLineage {
    constructor(config) {
        this.config = config;
        this.config.extensions = config.extensions || [];
        this.extensions = config.extensions || [];
        this.locator = config.locator;

        this.defaultFilters = [visible];
    }

    search(targets, scope) {
        if (this.config.preload) {
            let preloadedTargets = this.config.preload.targets;
            let labelIndex = this.config.preload.targets.length - 1;

            if (SearchLineage.isLastLabel(targets, labelIndex)) {
                var target = targets[labelIndex];

                if (preloadedTargets[labelIndex].properties.length < target.properties.length) {
                    target.properties = target.properties.filter(function (el) {
                        return preloadedTargets[labelIndex].properties.indexOf(el) < 0;
                    });

                    return Filter.filter(target, this.config.preload.elements, scope, this.extensions, this.defaultFilters);
                }
                else if (!preloadedTargets[labelIndex].position && target.position) {
                    let filteredElements = Filter.filter(target, this.config.preload.elements, scope, this.extensions, this.defaultFilters);
                    return Positional.filter(filteredElements, target, this.extensions, {target, scope});
                }
                else {
                    return this.config.preload.elements;
                }
            }
            else {
                return SearchLineage.traverseScopes(this.config.preload.elements, targets, labelIndex, this.config);
            }
        }
        else {
            return this.process(targets, scope, 0);
        }
    }

    process(targets, scope, labelIndex) {
        let target = targets[labelIndex];

        Extensions.beforeScopeEvent(this.extensions, {targets, scope});

        let elements = Locator.locate(target, scope, this.extensions, this.locator, this.config);

        let filteredElements = Filter.filter(target, elements, scope, this.extensions, this.defaultFilters);

        let positionalElements = Positional.filter(filteredElements, target, this.extensions, {target, scope});

        Extensions.afterScopeEvent(this.extensions, {targets, scope});

        if (SearchLineage.isLastLabel(targets, labelIndex)) {
            return positionalElements;
        }
        else {
            return SearchLineage.traverseScopes(positionalElements, targets, labelIndex, this.config);
        }
    }

    static traverseScopes(filteredElements, targets, labelIndex, config) {
        let newTargets = [];

        for (let c = 0; c < filteredElements.length; c++) {
            let childContainer = filteredElements[c];

            let foundItems = new SearchLineage(config).process(targets, childContainer, labelIndex + 1);
            newTargets = newTargets.concat(foundItems);
        }

        return unique(newTargets);
    }

    static isLastLabel(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
}
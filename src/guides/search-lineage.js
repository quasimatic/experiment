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
        // if (this.config.preload) {
        //     let preloadedTargets = this.config.preload.targets;
        //     let labelIndex = this.config.preload.targets.length - 1;
        //
        //     if (SearchLineage.isLastLabel(targets, labelIndex)) {
        //         var target = targets[labelIndex];
        //
        //         if (preloadedTargets[labelIndex].properties.length < target.properties.length) {
        //             target.properties = target.properties.filter(function (el) {
        //                 return preloadedTargets[labelIndex].properties.indexOf(el) < 0;
        //             });
        //
        //             return Filter.filter(target, this.config.preload.elements, scope, this.extensions, this.defaultFilters);
        //         }
        //         else if (!preloadedTargets[labelIndex].position && target.position) {
        //             let filteredElements = Filter.filter(target, this.config.preload.elements, scope, this.extensions, this.defaultFilters);
        //             return Positional.filter(filteredElements, target, this.extensions, {target, scope});
        //         }
        //         else {
        //             return this.config.preload.elements;
        //         }
        //     }
        //     else {
        //         return SearchLineage.traverseScopes(this.config.preload.elements, targets, labelIndex, this.config);
        //     }
        // }
        let labelIndex = 0;
        let skipTo = null;
        if (this.config.preload) {
            //let preloadedTargets = this.config.preload.targets;
            labelIndex = this.config.preload.targets.length - 1;

            if (this.config.preload.located) {
                skipTo = "filter";
            }
            else {
                skipTo = "locate";
            }
        }

        return this.process(targets, scope, labelIndex, skipTo);
    }

    process(targets, scope, labelIndex, skipTo) {
        let target = targets[labelIndex];

        Extensions.beforeScopeEvent(this.extensions, {targets, scope});

        let locatedElements = [];
        if (!skipTo || skipTo == "locate") {
            locatedElements = Locator.locate(target, scope, this.extensions, this.locator, this.config);
            if (this.config.debug) return this.debugInfo(target, {located: locatedElements});
        }
        else {
            locatedElements = this.config.preload.located;
        }

        let filteredElements = [];
        if (!skipTo || skipTo == "filter") {
            let preloadedFilteredElements = this.config.preload ? (this.config.preload.filtered || []) : [];
            filteredElements = Filter.filter(target, locatedElements, scope, this.extensions, this.defaultFilters, preloadedFilteredElements, this.config.debug);

            if (this.config.debug) {
                preloadedFilteredElements.push(filteredElements);
                return this.debugInfo(target, {
                    located: locatedElements,
                    filtered: preloadedFilteredElements
                });
            }
        }

        let positionalElements = Positional.filter(filteredElements, target, this.extensions, {target, scope});

        Extensions.afterScopeEvent(this.extensions, {targets, scope});

        if (SearchLineage.isLastLabel(targets, labelIndex)) {
            return positionalElements;
        }
        else {
            return SearchLineage.traverseScopes(positionalElements, targets, labelIndex, this.config);
        }
    }

    targetToSelector(target) {
        let selector = target.label;

        if (target.properties.length > 0)
            selector += `:${target.properties.join(",")}`;

        if (target.position)
            selector += `#${target.position}`;

        return selector;
    }

    debugInfo(target, data) {
        data.selector = this.targetToSelector(target);
        return data;
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
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
        let labelIndex = 0;

        if (this.config.preload) {
            labelIndex = this.config.preload.targets.length - 1;
        }

        return this.process(targets, scope, labelIndex);
    }

    process(targets, scope, labelIndex) {
        let preload = this.config.preload || {};
        let target = targets[labelIndex];

        Extensions.beforeScopeEvent(this.extensions, {targets, scope});

        let locatedElements = [];
        if (!preload.located) {
            locatedElements = Locator.locate(target, scope, this.extensions, this.locator, this.config);
            if (this.config.debug) return this.debugInfo(target, {located: locatedElements});
        }
        else {
            locatedElements = preload.located;
        }

        let filteredElements = [];
        
        if (!preload.filtered) {
            let preloadedFilteredElements = preload ? (preload.filtering || []) : [];
            if (preloadedFilteredElements.length > 0) {
                filteredElements = preloadedFilteredElements[preloadedFilteredElements.length - 1];
            }

            let filterCount = Filter.count(target, locatedElements, scope, this.extensions, this.defaultFilters, preloadedFilteredElements, this.config.debug);
            if (filterCount != preloadedFilteredElements.length) {
                filteredElements = Filter.filter(target, locatedElements, scope, this.extensions, this.defaultFilters, preloadedFilteredElements, this.config.debug);

                if (this.config.debug) {
                    if (filterCount != preloadedFilteredElements.length + 1) {
                        preloadedFilteredElements.push(filteredElements);
                        return this.debugInfo(target, {
                            located: locatedElements,
                            filtering: preloadedFilteredElements
                        });
                    }
                    else {
                        return this.debugInfo(target, {
                            located: locatedElements,
                            filtered: filteredElements
                        });
                    }
                }
            }
        }
        else {
            filteredElements = preload.filtered;
        }

        let positionalElements = Positional.filter(filteredElements, target, this.extensions, {target, scope});

        if (this.config.debug) {
            return this.debugInfo(target, {
                located: locatedElements,
                filtered: filteredElements,
                positional: positionalElements
            });
        }

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
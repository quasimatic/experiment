import nthFilter from "../position-filters/nth-filter";
import visible from "../filters/visible";
import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"
import unique from "../utils/unique"

export default class SearchLineage {
    constructor(config) {
        this.config = config;
        this.defaultLocator = config.locator;
        this.modifiers = config.modifiers || {};

        this.defaultFilters = [visible];
    }

    search(targets, context, labelIndex, customLabels) {
        labelIndex = labelIndex || 0;
        let target = targets[labelIndex];

        let locator = this._locatorFromModifier(target, this.modifiers) || this.defaultLocator;

        let elements = this._locateElements(target, context, locator, customLabels);

        elements = this._filterElements(target, elements, context);

        let filteredElements = nthFilter(elements, target.position);

        if (SearchLineage._lastItem(targets, labelIndex)) {
            return filteredElements;
        }
        else {
            return this._traverseScopes(filteredElements, targets, labelIndex, customLabels);
        }
    }

    _traverseScopes(filteredElements, targets, labelIndex, customLabels) {
        let newTargets = [];

        for (let c = 0; c < filteredElements.length; c++) {
            let childContainer = filteredElements[c];

            let foundItems = new SearchLineage(this.config).search(targets, childContainer, labelIndex + 1, customLabels);
            newTargets = newTargets.concat(foundItems);
        }

        return unique(newTargets);
    }

    _filterElements(target, elements, context) {
        let filters = this._filtersFromModifier(target, this.modifiers) || this.defaultFilters;
        return filters.reduce((previousElements, filter) => filter(previousElements, context), elements)
    }

    _filtersFromModifier(target, modifiers) {
        if (target.modifiers.length > 0) {
            let modifiersWithFilters = target.modifiers.filter(name => modifiers[name] && modifiers[name].filter)

            if (modifiersWithFilters.length != 0) {
                return modifiersWithFilters.map(name => modifiers[name].filter)
            }
        }

        return null;
    }

    _locatorFromModifier(target, modifiers) {
        if (target.modifiers.length > 0) {
            let modifierNames = target.modifiers.filter(name => modifiers[name] && modifiers[name].locator);
            if (modifierNames.length > 0)
                return this.modifiers[modifierNames[0]].locator;
        }
    }

    _locateElements(target, context, locator, customLabels) {
        let elements = [];
        let parent = context;
        while (parent && elements.length == 0) {
            elements = locator(target.label, parent, customLabels);
            parent = parent.parentNode;
        }

        elements = limitToScope(elements, context);
        elements = nextToScope(elements, context);

        return elements;
    }

    static _lastItem(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
}
import Extensions from "./extensions";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"
import nthFilter from "../position-filters/nth-filter";

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, guide) {
        unfilteredElements = limitToScope(unfilteredElements, scope);
        unfilteredElements = nextToScope(unfilteredElements, scope);
        
        let filters = Filter.filtersFromModifier(target, Extensions.modifiers(extensions)) || guide.defaultFilters;

        var beforeFilterElements = extensions.filter(e => e.beforeFilter).reduce((elements, e) => e.beforeFilter(elements, {target, scope}), unfilteredElements)

        var filteredElements = filters.reduce((elements, filter) => filter(elements, {target, scope}), beforeFilterElements);

        var ddd = extensions.filter(e => e.afterFilter).reduce((elements, e) => e.afterFilter(elements, {target, scope}), filteredElements)

        return nthFilter(ddd, target.position);
    }

    static filtersFromModifier(target, modifiers) {
        if (target.modifiers.length > 0) {
            let modifiersWithFilters = target.modifiers.filter(name => modifiers[name] && modifiers[name].filter);

            if (modifiersWithFilters.length != 0) {
                return modifiersWithFilters.map(name => modifiers[name].filter)
            }
        }

        return null;
    }
}
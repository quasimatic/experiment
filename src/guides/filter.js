import Extensions from "../utils/extensions";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"
import nthFilter from "../position-filters/nth-filter";

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, defaultFilters) {
        unfilteredElements = limitToScope(unfilteredElements, scope);
        unfilteredElements = nextToScope(unfilteredElements, scope);

        let filters = Filter.filtersFromModifier(target, Extensions.modifiers(extensions)) || defaultFilters;

        var beforeFilterElements = extensions.filter(e => e.beforeFilter).reduce((elements, e) => e.beforeFilter(elements, {target, scope}), unfilteredElements);

        var filteredElements = filters.reduce((elements, filter) => filter(elements, {target, scope}), beforeFilterElements);

        var afterFilterElements = extensions.filter(e => e.afterFilter).reduce((elements, e) => e.afterFilter(elements, {target, scope}), filteredElements);

        var beforePositionalElements = extensions.filter(e => e.beforePositional).reduce((elements, e) => e.beforePositional(elements, target.position, {target, scope}), afterFilterElements);

        var positionalElements = nthFilter(beforePositionalElements, target.position);

        var afterPositionalElements = extensions.filter(e => e.afterPositional).reduce((elements, e) => e.afterPositional(elements, target.position, {target, scope}), positionalElements);

        return afterPositionalElements;
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
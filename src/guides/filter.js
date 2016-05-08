import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"
import nthFilter from "../position-filters/nth-filter";

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, defaultFilters) {
        unfilteredElements = limitToScope(unfilteredElements, scope);
        unfilteredElements = nextToScope(unfilteredElements, scope);

        let filters = Filter.filtersFromProperty(target, Modifiers.properties(extensions)) || defaultFilters;

        var beforeFilterElements = extensions.filter(e => e.beforeFilter).reduce((elements, e) => e.beforeFilter(elements, {target, scope}), unfilteredElements);

        var filteredElements = filters.reduce((elements, filter) => filter(elements, {target, scope}), beforeFilterElements);

        var afterFilterElements = extensions.filter(e => e.afterFilter).reduce((elements, e) => e.afterFilter(elements, {target, scope}), filteredElements);

        var beforePositionalElements = extensions.filter(e => e.beforePositional).reduce((elements, e) => e.beforePositional(elements, target.position, {target, scope}), afterFilterElements);

        var positionalElements = nthFilter(beforePositionalElements, target.position);

        var afterPositionalElements = extensions.filter(e => e.afterPositional).reduce((elements, e) => e.afterPositional(elements, target.position, {target, scope}), positionalElements);

        return afterPositionalElements;
    }

    static filtersFromProperty(target, properties) {
        if (target.properties.length > 0) {
            let propertiesWithFilters = target.properties.filter(name => properties[name] && properties[name].filter);

            if (propertiesWithFilters.length != 0) {
                return propertiesWithFilters.map(name => properties[name].filter)
            }
        }

        return null;
    }
}
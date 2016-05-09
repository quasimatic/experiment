import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"
import nthFilter from "../position-filters/nth-filter";

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, defaultFilters) {
        unfilteredElements = limitToScope(unfilteredElements, scope);
        unfilteredElements = nextToScope(unfilteredElements, scope);

        let filters = Modifiers.getFilters(target, extensions) || defaultFilters;

        var data = {target, scope};

        var beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);

        var filteredElements = filters.reduce((elements, filter) => filter(elements, {target, scope}), beforeFilterElements);

        var afterFilterElements = Modifiers.afterFilters(filteredElements, extensions, data);

        var beforePositionalElements = Modifiers.beforePositional(afterFilterElements, target.position, extensions, data);

        var positionalElements = nthFilter(beforePositionalElements, target.position);

        return Modifiers.afterPositional(positionalElements, target.position, extensions, data);
    }
}
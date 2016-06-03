import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, defaultFilters) {
        unfilteredElements = limitToScope(unfilteredElements, scope);
        unfilteredElements = nextToScope(unfilteredElements, scope);

        let filters = Modifiers.getFilters(target, extensions) || defaultFilters;

        var data = {target, scope};

        var beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);

        var filteredElements = filters.reduce((elements, filter) => filter(elements, {target, scope}), beforeFilterElements);

        return Modifiers.afterFilters(filteredElements, extensions, data);
    }
}
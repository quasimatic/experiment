import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"

export default class Filter {
    static count(target, unfilteredElements, scope, extensions, defaultFilters, preloadedElements, debug) {
        let hasCustomFilters = Modifiers.getFilters(target, extensions);
        let filters = Modifiers.getFilters(target, extensions) || defaultFilters;

        return filters.length;
    }

    static filter(target, unfilteredElements, scope, extensions, defaultFilters, preloadedElements, debug) {
        let filters = Modifiers.getFilters(target, extensions) || defaultFilters;
        filters = filters.slice(preloadedElements.length);
        let data = {target, scope};
        let beforeFilterElements = [];

        if(preloadedElements.length == 0) {
            unfilteredElements = limitToScope(unfilteredElements, scope);
            unfilteredElements = nextToScope(unfilteredElements, scope);

            beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);
        }
        else {
            beforeFilterElements = preloadedElements[preloadedElements.length -1];
        }

        let filteredElements = [];

        if(debug) {
            filteredElements = filters[0](beforeFilterElements, data);

            if(filters.length > 1) {
                return filteredElements;
            }
        }
        else {
            filteredElements = filters.reduce((elements, filter) => filter(elements, data), beforeFilterElements);
        }

        return Modifiers.afterFilters(filteredElements, extensions, data);
    }
}
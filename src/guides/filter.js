import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"

import visible from "../filters/visible";

import {reduce} from "../utils/array-utils";

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, config, callback) {
        let filters = Modifiers.getFilters(target, extensions) || [visible];
        let data = {target, scope};

        unfilteredElements = limitToScope(unfilteredElements, scope);
        unfilteredElements = nextToScope(unfilteredElements, scope);

        let beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);
        let executeFilter = (filteredElements, filter, executeCallback) => customExecute(filter, filteredElements, data, (err, result)=> executeCallback(result));
        let afterFilters = (filteredElements) => callback(null, Modifiers.afterFilters(filteredElements, extensions, data));

        return reduce(filters, beforeFilterElements, executeFilter, afterFilters);
    }
}
import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"

import visible from "../filters/visible";

import {reduce} from "../utils/array-utils";

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, config, callback) {
        let filters = Modifiers.getFilters(target, extensions) || [visible];
        let data = {target, scope};

        return limitToScope(unfilteredElements, scope, (err, elements) =>{
            unfilteredElements = elements;
             return nextToScope(unfilteredElements, scope, (err, nextToScopeElements) => {
                 unfilteredElements = nextToScopeElements;

                 let beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);
                 let executeFilter = (filteredElements, filter, executeCallback) => customExecute(filter, filteredElements, data, executeCallback);
                 let afterFilters = (err, filteredElements) => callback(err, Modifiers.afterFilters(filteredElements, extensions, data));

                 return reduce(filters, beforeFilterElements, executeFilter, afterFilters);
            });
        });
    }
}
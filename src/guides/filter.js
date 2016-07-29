import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"

import {reduce} from "../utils/array-utils";

export default class Filter {
    static filter(target, unfilteredElements, scope, extensions, config, callback) {
        let filters = Modifiers.getFilters(target, extensions) || Modifiers.getDefaultFilters(extensions, config.defaultProperties);
        let data = {target, scope};

        return browserExecute(limitToScope, unfilteredElements, scope, (err, elements) =>{
             return browserExecute(nextToScope, elements, scope, (err, unfilteredElements) => {
                 let beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);
                 let executeFilter = (filteredElements, filter, executeCallback) => browserExecute(filter, {elements:filteredElements, target, scope}, executeCallback);
                 let afterFilters = (err, filteredElements) => callback(err, Modifiers.afterFilters(filteredElements, extensions, data));

                 return reduce(filters, beforeFilterElements, executeFilter, afterFilters);
            });
        });
    }
}
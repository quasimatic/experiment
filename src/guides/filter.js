import Modifiers from "../utils/modifiers";

import limitToScope from "../filters/limit-to-scope"
import nextToScope from "../filters/next-to-scope"

import {reduce} from "../utils/array-utils";

export default class Filter {
    static filter(data, callback) {
        let {target, elements:unfilteredElements, scopeElement, extensions, config} = data;
        let filters = Modifiers.getFilters(target, extensions) || Modifiers.getDefaultFilters(extensions, config.defaultProperties);

        return browserExecute(limitToScope, unfilteredElements, scopeElement, (err, unfilteredElements) => {
            let beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);
            let executeFilter = (filteredElements, filter, executeCallback) => browserExecute(filter, {
                elements: filteredElements,
                target,
                scopeElement
            }, executeCallback);
            let afterFilters = (err, filteredElements) => callback(err, Modifiers.afterFilters(filteredElements, extensions, data));

            return reduce(filters, beforeFilterElements, executeFilter, afterFilters);
        });
    }
}
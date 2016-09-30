import Modifiers from "../utils/modifiers";

import {reduce} from "../utils/array-utils";

export default class Filter {
    static filter(data, callback) {
        let {target, elements:unfilteredElements, extensions, config} = data;
        let filters = Modifiers.getFilters(target, extensions, config.defaultProperties) || Modifiers.getDefaultFilters(extensions, config.defaultProperties);

        let beforeFilterElements = Modifiers.beforeFilters(unfilteredElements, extensions, data);
        let executeFilter = (filteredElements, filter, executeCallback) => filter({
            ...data,
            elements: filteredElements
        }, executeCallback);
        let afterFilters = (err, filteredElements) => callback(err, Modifiers.afterFilters(filteredElements, extensions, data));

        return reduce(filters, beforeFilterElements, executeFilter, afterFilters);
    }
}
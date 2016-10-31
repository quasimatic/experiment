import Extensions from "../utils/extensions";
import {reduce} from "../utils/array-utils";
import log from "../log";

export default class Filter {
    static filter(data, callback) {
        let {target, elements:unfilteredElements, extensions, config} = data;
        let filters = Filter.getFilters(target, extensions, config.defaultProperties) || Filter.getDefaultFilters(extensions, config.defaultProperties);

        let beforeFilterElements = Filter.beforeFilters(unfilteredElements, extensions, data);
        let afterFilters = Filter.afterFilters(callback, extensions, data);

        return reduce(filters, beforeFilterElements, (filteredElements, filter, executeCallback) => {
            return filter({...data, elements: filteredElements}, function(err, results){
                log.debug("Filtered count:", results.length);
                return executeCallback(err, results);
            });
        }, afterFilters);
    }

    static beforeFilters(elements, extensions, data) {
        return extensions.filter(e => e.beforeFilters).reduce((elements, e) => e.beforeFilters(Object.assign(data, {elements})), elements);
    }

    static afterFilters(callback, extensions, data) {
        return (err, filteredElements) => callback(err, extensions.filter(e => e.afterFilters).reduce((elements, e) => e.afterFilters(Object.assign(data, {elements})), filteredElements));
    }

    static getFilters(target, extensions, defaultProperties) {
        let filters = [];
        let labels = Extensions.labels(extensions);
        let properties = Extensions.properties(extensions);

        if (labels[target.label] && Object.prototype.toString.call(labels[target.label]) !== '[object Array]' && labels[target.label].filter) {
            filters = filters.concat(labels[target.label].filter);
        }

        target.properties.forEach(name => {
            if (properties[name] && (properties[name].filter || typeof(properties[name]) == "function")) {
                filters = filters.concat(typeof(properties[name]) == "function" ? properties[name] : properties[name].filter);
            }
            else {
                let catchAlls = extensions.filter(e => e.filter);
                if (catchAlls.length > 0) {
                    if (filters.length == 0 && catchAlls[0].filter.useDefaultFiltersIfFirst) {
                        filters = filters.concat(Filter.getDefaultFilters(extensions, defaultProperties))
                    }

                    filters = filters.concat(catchAlls.map(e => e.filter.apply));
                }
            }
        });

        return filters.length > 0 ? filters : null;
    }

    static getDefaultFilters(extensions, defaultProperties) {
        let properties = Extensions.properties(extensions);

        if (defaultProperties.length > 0) {
            let filters = extensions.filter(e => e.filter).map(e => {
                return (data, callback) => {
                    let target = data.target;
                    return e.filter.apply({...data, target: {...target, properties: defaultProperties}}, callback);
                };
            });

            let propertiesWithFilters = defaultProperties.filter(name => properties[name] && (properties[name].filter || typeof(properties[name]) == "function"));

            if (propertiesWithFilters.length != 0) {
                filters = filters.concat(propertiesWithFilters.map(name => typeof(properties[name]) == "function" ? properties[name] : properties[name].filter));
            }

            return filters;
        }

        return [];
    }
}
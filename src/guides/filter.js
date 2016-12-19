import Extensions from "../utils/extensions";
import log from "../log";
import {reduce, unique} from "../utils/array-utils";
import emptyOnError from '../empty-on-error';

export default class Filter {
    static process(locatedTargets, data, handler) {
        var targetInfo = locatedTargets.reduce((result, info) => {
            result.elements = result.elements.concat(info.elements);
            result.scopeElements.push(info.scopeElement);
            return result;
        }, {elements: [], scopeElements: []});

        return unique(targetInfo.elements, emptyOnError((err, uniqueTargets) => {
            targetInfo.elements = uniqueTargets;

            return Filter.filter({...data, ...targetInfo}, handler);
        }));
    }

    static filter(data, callback) {
        let {target, elements:unfilteredElements, extensions, config} = data;
        let filters = Filter.getFilters(target, extensions, config.defaultOptions) || Filter.getDefaultFilters(extensions, config.defaultOptions);

        let beforeFilterElements = Filter.beforeFilters(unfilteredElements, extensions, data);
        let afterFilters = Filter.afterFilters(callback, extensions, data);

        return reduce(filters, beforeFilterElements, (filteredElements, filter, executeCallback) => {
            return filter({...data, elements: filteredElements}, function (err, results) {
                if (typeof(results) == 'undefined')
                    results = [];

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

    static getFilters(target, extensions, defaultOptions) {
        let filters = [];
        let labels = Extensions.labels(extensions);
        let options = Extensions.options(extensions);

        if (labels[target.label] && Object.prototype.toString.call(labels[target.label]) !== '[object Array]' && labels[target.label].filter) {
            filters = filters.concat(labels[target.label].filter);
        }

        target.options.forEach(name => {
            if (options[name] && (options[name].filter || typeof(options[name]) == "function")) {
                filters = filters.concat(typeof(options[name]) == "function" ? options[name] : options[name].filter);
            }
            else {
                let catchAlls = extensions.filter(e => e.filter);
                if (catchAlls.length > 0) {
                    if (filters.length == 0 && catchAlls[0].filter.useDefaultFiltersIfFirst) {
                        filters = filters.concat(Filter.getDefaultFilters(extensions, defaultOptions))
                    }

                    filters = filters.concat(catchAlls.map(e => e.filter.apply));
                }
            }
        });

        return filters.length > 0 ? filters : null;
    }

    static getDefaultFilters(extensions, defaultOptions) {
        let options = Extensions.options(extensions);

        if (defaultOptions.length > 0) {
            let filters = extensions.filter(e => e.filter).map(e => {
                return (data, callback) => {
                    let target = data.target;
                    return e.filter.apply({...data, target: {...target, options: defaultOptions}}, callback);
                };
            });

            let optionsWithFilters = defaultOptions.filter(name => options[name] && (options[name].filter || typeof(options[name]) == "function"));

            if (optionsWithFilters.length != 0) {
                filters = filters.concat(optionsWithFilters.map(name => typeof(options[name]) == "function" ? options[name] : options[name].filter));
            }

            return filters;
        }

        return [];
    }
}
import Extensions from '../utils/extensions';
import state from '../state';

export default class FilterCollector {
    static beforeFilters(elements, data) {
        let extensions = state.getExtensions();
        return extensions.filter(e => e.beforeFilters).reduce((elements, e) => e.beforeFilters(Object.assign(data, {elements})), elements);
    }

    static afterFilters(callback, data) {
        let extensions = state.getExtensions();
        return (err, filteredElements) => callback(err, extensions.filter(e => e.afterFilters).reduce((elements, e) => e.afterFilters(Object.assign(data, {elements})), filteredElements));
    }

    static getFilters(target, extensions = state.getExtensions()) {
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
                        filters = filters.concat(FilterCollector.getDefaultFilters())
                    }

                    filters = filters.concat(catchAlls.map(e => e.filter.apply));
                }
            }
        });

        return filters.length > 0 ? filters : FilterCollector.getDefaultFilters();
    }

    static getDefaultFilters(extensions = state.getExtensions()) {
        let defaultOptions = state.getConfig().defaultOptions;
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

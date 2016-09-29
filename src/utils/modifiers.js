export default class Modifiers {
    static beforeFilters(elements, extensions, data) {
        return extensions.filter(e => e.beforeFilters).reduce((elements, e) => e.beforeFilters(Object.assign(data, {elements})), elements);
    }

    static afterFilters(elements, extensions, data) {
        return extensions.filter(e => e.afterFilters).reduce((elements, e) => e.afterFilters(Object.assign(data, {elements})), elements);
    }

    static beforePositional(elements, position, extensions, data) {
        return extensions.filter(e => e.beforePositional).reduce((elements, e) => e.beforePositional(Object.assign(data, {
            elements,
            position
        })), elements);
    }

    static afterPositional(elements, position, extensions, data) {
        return extensions.filter(e => e.afterPositional).reduce((elements, e) => e.afterPositional(Object.assign(data, {
            elements,
            position
        })), elements);
    }

    static getFilters(target, extensions) {
        let filters = [];
        let labels = Modifiers.labels(extensions);
        let properties = Modifiers.properties(extensions);

        if (labels[target.label] && labels[target.label].filter) {
            filters = filters.concat(labels[target.label].filter);
        }

        if (target.properties.length > 0) {
            let propertiesWithFilters = target.properties.filter(name => properties[name] && (properties[name].filter || typeof(properties[name]) == "function"));

            if (propertiesWithFilters.length != 0) {
                filters = filters.concat(propertiesWithFilters.map(name => typeof(properties[name]) == "function" ? properties[name] : properties[name].filter));
            }
        }

        return filters.length > 0 ? filters : null;
    }

    static getDefaultFilters(extensions, defaultProperties) {
        let filters = [];
        let properties = Modifiers.properties(extensions);

        if (defaultProperties.length > 0) {
            let propertiesWithFilters = defaultProperties.filter(name => properties[name] && (properties[name].filter || typeof(properties[name]) == "function"));

            if (propertiesWithFilters.length != 0) {
                filters = filters.concat(propertiesWithFilters.map(name => typeof(properties[name]) == "function" ? properties[name] : properties[name].filter));
            }
        }

        return filters;
    }

    static labels(extensions) {
        return extensions.filter(e => e.labels).reduce((m, e) => Object.assign({}, m, e.labels), {});
    }

    static properties(extensions) {
        return extensions.filter(e => e.properties).reduce((m, e) => Object.assign({}, m, e.properties), {});
    }

    static getLocators(target, extensions) {
        let locators = [];
        let labels = Modifiers.labels(extensions);
        let properties = Modifiers.properties(extensions);

        if (labels[target.label]) {
            if (typeof(labels[target.label]) == 'string') {
                locators = locators.concat(function ({glanceSelector}, handler) {
                    return glanceSelector(labels[target.label], handler);
                });
            }

            if (typeof(labels[target.label]) == 'function') {
                locators = locators.concat(labels[target.label]);
            }

            if (labels[target.label].locate) {
                locators = locators.concat(labels[target.label].locate);
            }
        }

        if (target.properties.length > 0) {
            let propertiesWithlocators = target.properties.filter(name => properties[name] && (properties[name].locate));

            if (propertiesWithlocators.length != 0) {
                locators = locators.concat(propertiesWithlocators.map(name => {
                    if (typeof(properties[name].locate) == 'string')
                        return function ({glanceSelector}, handler) {
                            return glanceSelector(properties[name].locate, handler);
                        };
                    else
                        return properties[name].locate;
                }));
            }
        }

        return locators.length > 0 ? locators : null;
    }

    static getDefaultLocators(extensions, defaultProperties) {
        let properties = Modifiers.properties(extensions);

        if (defaultProperties.length > 0) {
            let locators = extensions.filter(e => e.locate).map(e => {
                return (data, callback) => {
                    let target = data.target;
                    return e.locate({...data, target: {...target, properties:defaultProperties}}, callback);
                };
            });

            let propertiesWithlocators = defaultProperties.filter(name => properties[name] && (properties[name].locate));

            if (propertiesWithlocators.length != 0) {
                locators = locators.concat(propertiesWithlocators.map(name => properties[name].locate));
            }

            return locators;
        }

        return [];
    }

    static locatorForLabel(key, extensions) {
        return extensions.filter(e => e.labels && e.labels[key]).map(e => e.labels[key]);
    }

    static locateBeforeFromLabel(label, extensions) {
        return Modifiers.locatorForLabel(label, extensions).filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static locateAfterFromLabel(label, extensions) {
        return Modifiers.locatorForLabel(label, extensions).filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static beforeLocate(extensions) {
        return extensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static afterLocate(extensions) {
        return extensions.filter(e => e.afterLocate).map(e => e.afterLocate);
    }
}
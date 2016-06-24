import mergeObjects from "../utils/merge-objects";

export default class Modifiers {
    static beforeFilters(elements, extensions, data) {
        return extensions.filter(e => e.beforeFilters).reduce((elements, e) => e.beforeFilters(elements, data), elements);
    }

    static afterFilters(elements, extensions, data) {
        return extensions.filter(e => e.afterFilters).reduce((elements, e) => e.afterFilters(elements, data), elements);
    }

    static beforePositional(elements, position, extensions, data) {
        return extensions.filter(e => e.beforePositional).reduce((elements, e) => e.beforePositional(elements, position, data), elements);
    }

    static afterPositional(elements, position, extensions, data) {
        return extensions.filter(e => e.afterPositional).reduce((elements, e) => e.afterPositional(elements, position, data), elements);
    }

    static getFilters(target, extensions) {
        let filters = [];
        let labels = Modifiers.labels(extensions);
        let properties = Modifiers.properties(extensions)

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

    static labels(extensions) {
        return extensions.filter(e => e.labels).reduce((m, e) => mergeObjects(m, e.labels), {});
    }

    static properties(extensions) {
        return extensions.filter(e => e.properties).reduce((m, e) => mergeObjects(m, e.properties), {});
    }
    
    static getLocator(target, extensions) {
        let labels = Modifiers.labels(extensions);
        let properties = Modifiers.properties(extensions)

        if (target.properties.length > 0) {
            let propertyNames = target.properties.filter(name => properties[name] && properties[name].locate);
            
            if (propertyNames.length > 0)
                return properties[propertyNames[0]].locate;
        }

        if(labels[target.label] && labels[target.label].locate) {
            return labels[target.label].locate;
        }

        return null;
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
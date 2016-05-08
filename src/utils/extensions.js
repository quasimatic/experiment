import mergeObjects from "../utils/merge-objects";

export default class Modifiers {
    static locatorForLabel(key, extensions) {
        return extensions.filter(e => e.labels && e.labels[key]).map(e => e.labels[key]);
    }

    static locateBeforeFromLabel(label, extensions) {
        return Modifiers.locatorForLabel(label, extensions).filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static locateAfterFromLabel(label, extensions) {
        return Modifiers.locatorForLabel(label, extensions).filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static locateBeforeEvent(extensions) {
        return extensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static locateAfterEvent(extensions) {
        return extensions.filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static properties(extensions) {
        return extensions.filter(e => e.properties).reduce((m, e) => mergeObjects(m, e.properties), {});
    }

    static locatorFromProperty(target, properties) {
        if (target.properties.length > 0) {
            let propertyNames = target.properties.filter(name => properties[name] && properties[name].locator);
            if (propertyNames.length > 0)
                return properties[propertyNames[0]].locator;
        }
    }
}
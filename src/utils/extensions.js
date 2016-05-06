import mergeObjects from "../utils/merge-objects";

export default class Extensions {
    static locatorForLabel(key, extensions) {
        return extensions.filter(e => e.labels && e.labels[key]).map(e => e.labels[key]);
    }

    static locateBeforeFromLabel(label, extensions) {
        return Extensions.locatorForLabel(label, extensions).filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static locateAfterFromLabel(label, extensions) {
        return Extensions.locatorForLabel(label, extensions).filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static locateBeforeEvent(extensions) {
        return extensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static locateAfterEvent(extensions) {
        return extensions.filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static modifiers(extensions) {
        return extensions.filter(e => e.modifiers).reduce((m, e) => mergeObjects(m, e.modifiers), {});
    }

    static locatorFromModifier(target, modifiers) {
        if (target.modifiers.length > 0) {
            let modifierNames = target.modifiers.filter(name => modifiers[name] && modifiers[name].locator);
            if (modifierNames.length > 0)
                return modifiers[modifierNames[0]].locator;
        }
    }
}
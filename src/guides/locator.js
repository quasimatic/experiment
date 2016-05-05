import Extensions from "./extensions";

export default class Locator {
    static locate(target, scope, extensions, customLabels, guide) {
        let labelExtensions = Extensions.locatorForLabel(extensions, target);
        let locator = Locator.locatorFromModifier(target, guide.modifiers) || guide.locator;

        let elements = [];
        let parent = scope;

        var beforeLocate = labelExtensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
        var afterLocate = labelExtensions.filter(e => e.afterLocate).map(e => e.afterLocate);

        beforeLocate.forEach(before => before({label: target.label}));

        while (parent && elements.length == 0) {
            elements = locator(target.label, parent, customLabels);
            parent = parent.parentNode;
        }

        afterLocate.forEach(before => before({label: target.label}));
        
        return elements;
    }

    static locatorFromModifier(target, modifiers) {
        if (target.modifiers.length > 0) {
            let modifierNames = target.modifiers.filter(name => modifiers[name] && modifiers[name].locator);
            if (modifierNames.length > 0)
                return modifiers[modifierNames[0]].locator;
        }
    }
}
import Extensions from "../utils/extensions";

export default class Locator {
    static locate(target, scope, extensions, defaultLocator, config) {
        let locator = Extensions.locatorFromModifier(target, Extensions.modifiers(extensions)) || defaultLocator;

        let elements = [];
        let parent = scope;

        let beforeLocate = Extensions.locateBeforeHook(target, extensions);
        let afterLocate = Extensions.locateAfterHook(target, extensions);

        beforeLocate.forEach(before => before({label: target.label}));

        while (parent && elements.length == 0) {
            elements = locator(target.label, parent, config);
            parent = parent.parentNode;
        }

        afterLocate.forEach(before => before({label: target.label}));
        
        return elements;
    }
}
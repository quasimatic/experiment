import Extensions from "../utils/extensions";

export default class Locator {
    static locate(target, scope, extensions, defaultLocator, config) {
        let locator = Extensions.locatorFromModifier(target, Extensions.modifiers(extensions)) || defaultLocator;

        let elements = [];
        let parent = scope;

        let beforeLocate = Extensions.locateBeforeFromLabel(target.label, extensions);
        let afterLocate = Extensions.locateAfterFromLabel(target.label, extensions);

        Extensions.locateBeforeEvent(extensions).forEach(before => before({label: target.label}));
        beforeLocate.forEach(before => before({label: target.label}));

        while (parent && elements.length == 0) {
            elements = locator(target.label, parent, config);
            parent = parent.parentNode;
        }

        afterLocate.forEach(after => after({label: target.label}));
        Extensions.locateAfterEvent(extensions).forEach(after => after({label: target.label}));

        return elements;
    }
}
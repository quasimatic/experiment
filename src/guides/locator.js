import Modifiers from "../utils/modifiers";

export default class Locator {
    static locate(target, scope, extensions, defaultLocator, config) {
        let elements = [];
        let parent = scope;

        let locate = Modifiers.getLocator(target, extensions) || defaultLocator;

        let beforeLocate = Modifiers.locateBeforeFromLabel(target.label, extensions);
        let afterLocate = Modifiers.locateAfterFromLabel(target.label, extensions);

        Modifiers.beforeLocate(extensions).forEach(before => before({target: target, scope: scope}));

        beforeLocate.forEach(before => before({label: target.label}));
        
        while (parent && elements.length == 0) {
            elements = [].concat(locate(target.label, parent, config));
            parent = parent.parentNode;
        }

        afterLocate.forEach(after => after({label: target.label}));
        Modifiers.afterLocate(extensions).forEach(after => after({target: target, scope: scope}));

        return elements;
    }
}
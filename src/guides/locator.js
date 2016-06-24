import Modifiers from "../utils/modifiers";

export default class Locator {
    static locate(target, scope, extensions, config, callback) {
        let parent = scope;
        let defaultLocator = config.locator;

        let locate = Modifiers.getLocator(target, extensions) || defaultLocator;

        let beforeLocate = Modifiers.locateBeforeFromLabel(target.label, extensions);
        let afterLocate = Modifiers.locateAfterFromLabel(target.label, extensions);

        Modifiers.beforeLocate(extensions).forEach(before => before({target: target, scope: scope}));

        beforeLocate.forEach(before => before({label: target.label}));

        return Locator.locateInParent(locate, [], parent, target, config, function (elements) {
            afterLocate.forEach(after => after({label: target.label}));
            Modifiers.afterLocate(extensions).forEach(after => after({target: target, scope: scope}));

            return callback(elements);
        });
    }

    static locateInParent(locate, elements, parent, target, config, callback) {
        if (parent && elements.length == 0) {
            return locate(target.label, parent, config, function (foundElements) {
                return Locator.locateInParent(locate, [].concat(foundElements), parent.parentNode, target, config, callback);
            });
        }
        else {
            return callback(elements);
        }
    }
}
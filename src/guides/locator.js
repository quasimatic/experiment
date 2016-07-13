import Modifiers from "../utils/modifiers";

export default class Locator {
    static locate(target, scope, extensions, config, resultHandler) {
        let parent = scope;
        let defaultLocator = config.locator;

        let locate = Modifiers.getLocator(target, extensions) || defaultLocator;

        let beforeLocate = Modifiers.locateBeforeFromLabel(target.label, extensions);
        let afterLocate = Modifiers.locateAfterFromLabel(target.label, extensions);

        Modifiers.beforeLocate(extensions).forEach(before => before({target: target, scope: scope}));

        beforeLocate.forEach(before => before({label: target.label}));

        return Locator.locateInParent(locate, [], parent, target, config, function (err, elements) {
            afterLocate.forEach(after => after({label: target.label}));
            Modifiers.afterLocate(extensions).forEach(after => after({target: target, scope: scope}));

            return resultHandler(err, elements);
        });
    }

    static locateInParent(locate, elements, parent, target, config, resultHandler) {
        if (parent && elements.length == 0) {
            return locate(target.label, parent, config, function (err, foundElements) {
                return Locator.locateInParent(locate, [].concat(foundElements), parent.parentNode, target, config, resultHandler);
            });
        }
        else {
            return resultHandler(null, elements);
        }
    }
}
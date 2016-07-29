import log from '../logger';
import Modifiers from "../utils/modifiers";
import {reduce} from "../utils/array-utils";

export default class Locator {
    static locate(target, scope, config, resultHandler) {
        let extensions = config.extensions;
        let parent = scope;

        var locators = Modifiers.getLocators(target, extensions) || Modifiers.getDefaultLocators(extensions, config.defaultProperties);

        let locate = (target, resultHandler) => {
            return reduce(locators, [], (elements, locator, handler) => {
                return locator(target, function (err, e) {
                    elements = elements.concat(e);
                    return handler(err, elements);
                });
            }, resultHandler);
        };

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
            log.debug("Elements not found, trying parent");
            return locate({label: target.label, container:parent, config:config}, (err, foundElements) => {
                return browserExecute(function (node, handler) {
                    return handler(null, { parentNode: node.parentNode, continue: node.parentNode != null && node.parentNode.outerHTML != null});
                }, parent, (err, data) => {
                    if(data.continue)
                        return Locator.locateInParent(locate, [].concat(foundElements), data.parentNode, target, config, resultHandler);

                    return resultHandler(null, elements);
                });

            });
        }
        else {
            return resultHandler(null, elements);
        }
    }
}
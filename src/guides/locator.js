import log from '../logger';
import Modifiers from "../utils/modifiers";
import {reduce} from "../utils/array-utils";

export default class Locator {
    static locate(data, resultHandler) {
        let {target, scopeElement, config, extensions} = data;
        let parent = scopeElement;

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

        Modifiers.beforeLocate(extensions).forEach(before => before(data));

        beforeLocate.forEach(before => before({label: target.label}));

        return Locator.locateInParent(locate, [], parent, target, data, function (err, elements) {
            afterLocate.forEach(after => after({label: target.label}));
            Modifiers.afterLocate(extensions).forEach(after => after(data));

            return resultHandler(err, elements);
        });
    }

    static locateInParent(locate, elements, parent, target, data, resultHandler) {
        if (parent && elements.length == 0) {
            log.debug("Elements not found, trying parent");
            return locate({...data, label: target.label, scopeElement:parent}, (err, foundElements) => {
                return browserExecute(function (node, handler) {
                    return handler(null, { parentNode: node.parentNode, continue: node.parentNode != null && node.parentNode.outerHTML != null});
                }, parent, (err, result) => {
                    if(result.continue)
                        return Locator.locateInParent(locate, [].concat(foundElements), result.parentNode, target, data, resultHandler);

                    return resultHandler(null, elements);
                });

            });
        }
        else {
            return resultHandler(null, elements);
        }
    }
}
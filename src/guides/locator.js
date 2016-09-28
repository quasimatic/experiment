import log from '../logger';
import Modifiers from "../utils/modifiers";
import {reduce} from "../utils/array-utils";
import isDescendant from "../utils/is-descendant";

export default class Locator {
    static locate(data, resultHandler) {
        let {target, scopeElement, scopeElements, config, extensions} = data;
        let parent = scopeElement;

        var locators = Modifiers.getLocators(target, extensions) || Modifiers.getDefaultLocators(extensions, config.defaultProperties);

        let locate = (target, resultHandler) => {
            return reduce(locators, [], (elements, locator, handler) => {
                return locator(target, function (err, e) {
                    if(err) {
                        return handler(err, []);
                    }

                    if (e.length > 0) {
                        log.debug(`Matched ${e.length}`);
                    }

                    elements = elements.concat(e);

                    return handler(err, elements);
                });
            }, resultHandler);
        };

        let beforeLocate = Modifiers.locateBeforeFromLabel(target.label, extensions);
        let afterLocate = Modifiers.locateAfterFromLabel(target.label, extensions);

        Modifiers.beforeLocate(extensions).forEach(before => before(data));

        beforeLocate.forEach(before => before({label: target.label}));

        return Locator.locateInParent(locate, [], parent, null, scopeElements, target, data, function (err, elements) {
            if(err) {
                return resultHandler(err, []);
            }

            afterLocate.forEach(after => after({label: target.label}));
            Modifiers.afterLocate(extensions).forEach(after => after(data));

            return resultHandler(err, elements);
        });
    }

    static locateInParent(locate, elements, parent, previousParent, scopeElements, target, data, resultHandler) {
        if (parent && elements.length == 0) {
            return locate({...data, label: target.label, scopeElement:parent}, (err, foundElements) => {
                if(err) {
                    return resultHandler(err, []);
                }

                return browserExecute(function (node, handler) {
                    return handler(null, { node: node, parentNode: node.parentNode, continue: node.parentNode != null && node.parentNode.outerHTML != null});
                }, parent, (err, result) => {
                    if(err) {
                        return resultHandler(err, []);
                    }

                    let flattenedElements = [].concat(foundElements);

                    flattenedElements = flattenedElements.filter(e => scopeElements.indexOf(e) == -1 || scopeElements.filter(s => isDescendant(s, e)).length > 0);

                    if(result.continue && flattenedElements.length == 0) {
                        log.debug("Elements not found, trying parent");
                        return Locator.locateInParent(locate, [].concat(foundElements), result.parentNode, result.node, scopeElements, target, data, resultHandler);
                    }

                    return resultHandler(null, flattenedElements);
                });

            });
        }
        else {
            elements = elements.filter(e => scopeElements.indexOf(e) == -1 || scopeElements.filter(s => isDescendant(s, e)).length > 0);

            return resultHandler(null, elements);
        }
    }
}
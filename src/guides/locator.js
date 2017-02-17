import log from '../log';
import LocatorCollector from './locator-collector';
import {reduce} from "../utils/array-utils";
import isDescendant from "../utils/is-descendant";
import browserExecute from '../browser-execute'

let locatorCollector;

export default class Locator {
    static locate(data, resultHandler) {
        let {target, containerElement, scopeElements, state} = data;
        let parent = containerElement;

        let locatorCollector = new LocatorCollector(state.getExtensions(), state.getConfig().defaultOptions);
        var locators = locatorCollector.getLocators(target);

        let locate = (target, resultHandler) => {
            return reduce(locators, [], (elements, locator, handler) => {
                return locator(target, function (err, e) {
                    if (err) {
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

        let beforeLocate = locatorCollector.getBeforeLocateFromLabels(target.label);
        let afterLocate = locatorCollector.getAfterLocateFromLabels(target.label);

        locatorCollector.getBeforeLocate().forEach(before => before(data));

        beforeLocate.forEach(before => before({label: target.label}));

        return Locator.locateInParent(locate, [], parent, scopeElements, target, data, function (err, elements) {
            if (err) {
                return resultHandler(err, []);
            }

            afterLocate.forEach(after => after({label: target.label}));
            locatorCollector.getAfterLocate().forEach(after => after(data));

            return resultHandler(err, elements);
        });
    }

    static locateInParent(locate, elements, parent, scopeElements, target, data, resultHandler) {
        let {state} = data;
        if (parent && elements.length == 0) {
            return locate({...data, label: target.label, containerElement: parent}, (err, foundElements) => {
                if (err) {
                    return resultHandler(err, []);
                }

                return browserExecute(function (node, handler) {
                    return handler(null, {
                        node: node,
                        parentNode: node.parentNode,
                        continue: node.parentNode != null && node.parentNode.outerHTML != null
                    });
                }, parent, (err, result) => {
                    if (err) {
                        return resultHandler(err, []);
                    }

                    let flattenedElements = [].concat(foundElements);

                    flattenedElements = flattenedElements.filter(e => scopeElements.indexOf(e) == -1 || scopeElements.filter(s => isDescendant(s, e)).length > 0);

                    if (result.continue && flattenedElements.length == 0 && state.getContainerElements().indexOf(parent) == -1) {
                        log.debug("Elements not found, trying parent");
                        return Locator.locateInParent(locate, [].concat(foundElements), result.parentNode, scopeElements, target, data, resultHandler);
                    }

                    state.addContainerElement(parent);

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
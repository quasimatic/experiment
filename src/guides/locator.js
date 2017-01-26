import log from '../log';
import Extensions from "../utils/extensions";
import {reduce} from "../utils/array-utils";
import isDescendant from "../utils/is-descendant";
import browserExecute from '../browser-execute'
import containerElements from "./container-elements";

export default class Locator {
    static locate(data, resultHandler) {
        let {target, scopeElement, scopeElements, config, extensions} = data;
        let parent = scopeElement;

        var locators = Locator.getLocators(target, extensions) || Locator.getDefaultLocators(extensions, config.defaultOptions);

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

        let beforeLocate = Locator.locateBeforeFromLabel(target.label, extensions);
        let afterLocate = Locator.locateAfterFromLabel(target.label, extensions);

        Locator.beforeLocate(extensions).forEach(before => before(data));

        beforeLocate.forEach(before => before({label: target.label}));

        return Locator.locateInParent(locate, [], parent, scopeElements, target, data, function (err, elements) {
            if (err) {
                return resultHandler(err, []);
            }

            afterLocate.forEach(after => after({label: target.label}));
            Locator.afterLocate(extensions).forEach(after => after(data));

            return resultHandler(err, elements);
        });
    }

    static locateInParent(locate, elements, parent, scopeElements, target, data, resultHandler) {
        if (parent && elements.length == 0) {
            return locate({...data, label: target.label, scopeElement: parent}, (err, foundElements) => {
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

                    if (result.continue && flattenedElements.length == 0 && containerElements.indexOf(parent) == -1) {
                        log.debug("Elements not found, trying parent");
                        return Locator.locateInParent(locate, [].concat(foundElements), result.parentNode, scopeElements, target, data, resultHandler);
                    }

                    containerElements.push(parent);

                    return resultHandler(null, flattenedElements);
                });

            });
        }
        else {
            elements = elements.filter(e => scopeElements.indexOf(e) == -1 || scopeElements.filter(s => isDescendant(s, e)).length > 0);

            return resultHandler(null, elements);
        }
    }

    static getLocator(locator) {
        if (Object.prototype.toString.call(locator) === '[object Array]') {
            return locator.map(function (label) {
                return function ({glanceSelector}, handler) {
                    return glanceSelector(label, handler);
                }
            });
        }
        else if (typeof(locator) == 'string') {
            return [function ({glanceSelector}, handler) {
                return glanceSelector(locator, handler);
            }];
        }
        else if (typeof(locator) == 'function') {
            return [locator];
        }

        return [];
    }

    static getLocators(target, extensions) {
        let locators = [];
        let labels = Extensions.labels(extensions);
        let options = Extensions.options(extensions);

        if (labels[target.label]) {
            if (labels[target.label].locate) {
                locators = Locator.getLocator(labels[target.label].locate)
            }
            else {
                locators = Locator.getLocator(labels[target.label])
            }
        }

        target.options.forEach(name => {
            if (options[name] && options[name].locate) {
                locators = locators.concat(Locator.getLocator(options[name].locate))
            }
            else {
                let catchAlls = extensions.filter(e => {
                    if (e.locator) {
                        return e.locator.check({label: target.label, target});
                    }

                    return false;
                });

                if (catchAlls.length > 0) {
                    locators = locators.concat(catchAlls.map(e => e.locator.locate));
                }
            }
        });

        return locators.length > 0 ? locators : null;
    }

    static getDefaultLocators(extensions, defaultOptions) {
        let options = Extensions.options(extensions);

        if (defaultOptions.length > 0) {
            let locators = extensions.filter(e => e.locator).map(e => {
                return (data, callback) => {
                    let target = data.target;
                    return e.locator.locate({...data, target: {...target, options: defaultOptions}}, callback);
                };
            });

            let optionsWithlocators = defaultOptions.filter(name => options[name] && (options[name].locate));

            if (optionsWithlocators.length != 0) {
                locators = locators.concat(optionsWithlocators.map(name => options[name].locate));
            }

            return locators;
        }

        return [];
    }

    static locatorForLabel(key, extensions) {
        return extensions.filter(e => e.labels && e.labels[key]).map(e => e.labels[key]);
    }

    static locateBeforeFromLabel(label, extensions) {
        return Locator.locatorForLabel(label, extensions).filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static locateAfterFromLabel(label, extensions) {
        return Locator.locatorForLabel(label, extensions).filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static beforeLocate(extensions) {
        return extensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static afterLocate(extensions) {
        return extensions.filter(e => e.afterLocate).map(e => e.afterLocate);
    }
}
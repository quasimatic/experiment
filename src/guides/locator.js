import log from '../logger';
import Extensions from "../utils/extensions";
import {reduce} from "../utils/array-utils";
import isDescendant from "../utils/is-descendant";

export default class Locator {
    static locate(data, resultHandler) {
        let {target, scopeElement, scopeElements, config, extensions} = data;
        let parent = scopeElement;

        var locators = Locator.getLocators(target, extensions) || Locator.getDefaultLocators(extensions, config.defaultProperties);

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

        let beforeLocate = Locator.locateBeforeFromLabel(target.label, extensions);
        let afterLocate = Locator.locateAfterFromLabel(target.label, extensions);

        Locator.beforeLocate(extensions).forEach(before => before(data));

        beforeLocate.forEach(before => before({label: target.label}));

        return Locator.locateInParent(locate, [], parent, null, scopeElements, target, data, function (err, elements) {
            if(err) {
                return resultHandler(err, []);
            }

            afterLocate.forEach(after => after({label: target.label}));
            Locator.afterLocate(extensions).forEach(after => after(data));

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


    static getLocators(target, extensions) {
        let locators = [];
        let labels = Extensions.labels(extensions);
        let properties = Extensions.properties(extensions);

        if (labels[target.label]) {
            if (typeof(labels[target.label]) == 'string') {
                locators = locators.concat(function ({glanceSelector}, handler) {
                    return glanceSelector(labels[target.label], handler);
                });
            }

            if (typeof(labels[target.label]) == 'function') {
                locators = locators.concat(labels[target.label]);
            }

            if (labels[target.label].locate) {
                locators = locators.concat(labels[target.label].locate);
            }
        }

        target.properties.forEach(name => {
            if (properties[name] && (properties[name].locate)) {
                if (typeof(properties[name].locate) == 'string')
                    locators = locators.concat(function ({glanceSelector}, handler) {
                        return glanceSelector(properties[name].locate, handler);
                    });
                else
                    locators = locators.concat(properties[name].locate);
            }
            else {
                let catchAlls = extensions.filter(e => {
                    if(e.locator) {
                        return e.locator.check({label:target.label, target});
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

    static getDefaultLocators(extensions, defaultProperties) {
        let properties = Extensions.properties(extensions);

        if (defaultProperties.length > 0) {
            let locators = extensions.filter(e => e.locator).map(e => {
                return (data, callback) => {
                    let target = data.target;
                    return e.locator.locate({...data, target: {...target, properties: defaultProperties}}, callback);
                };
            });

            let propertiesWithlocators = defaultProperties.filter(name => properties[name] && (properties[name].locate));

            if (propertiesWithlocators.length != 0) {
                locators = locators.concat(propertiesWithlocators.map(name => properties[name].locate));
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
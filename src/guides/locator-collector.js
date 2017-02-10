import Extensions from "../utils/extensions";
import state from "../state"

export default class LocatorCollector {
    static getLocator(locator) {
        if (Object.prototype.toString.call(locator) === '[object Array]') {
            return locator.map(function (label) {
                return function ({glanceSelector}, handler) {
                    return glanceSelector(label, handler);
                }
            });
        }
        else if (typeof(locator) === 'string') {
            return [function ({glanceSelector}, handler) {
                return glanceSelector(locator, handler);
            }];
        }
        else if (typeof(locator) === 'function') {
            return [locator];
        }

        return [];
    }

    static getLocators(target, extensions = []) {
        let locators = [];
        let labels = Extensions.labels(extensions);
        let options = Extensions.options(extensions);

        if (labels[target.label]) {
            if (labels[target.label].locate) {
                locators = LocatorCollector.getLocator(labels[target.label].locate)
            }
            else {
                locators = LocatorCollector.getLocator(labels[target.label])
            }
        }

        target.options.forEach(name => {
            if (options[name] && options[name].locate) {
                locators = locators.concat(LocatorCollector.getLocator(options[name].locate))
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

        return locators.length > 0 ? locators : LocatorCollector.getDefaultLocators(extensions);
    }

    static getDefaultLocators(extensions) {
        let defaultOptions = state.getConfig().defaultOptions;
        let options = Extensions.options(extensions);

        if (defaultOptions.length > 0) {
            let locators = extensions.filter(e => e.locator).map(e => {
                return (data, callback) => {
                    let target = data.target;
                    return e.locator.locate({...data, target: {...target, options: defaultOptions}}, callback);
                };
            });

            let optionsWithlocators = defaultOptions.filter(name => options[name] && (options[name].locate));

            if (optionsWithlocators.length !== 0) {
                locators = locators.concat(optionsWithlocators.map(name => options[name].locate));
            }

            return locators;
        }

        return [];
    }

    static getBeforeLocateFromLabels(label, extensions) {
        return LocatorCollector.getExtensionLabels(label, extensions).filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static getAfterLocateFromLabels(label, extensions) {
        return LocatorCollector.getExtensionLabels(label, extensions).filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static getBeforeLocate(extensions) {
        return extensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static getAfterLocate(extensions) {
        return extensions.filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static getExtensionLabels(key, extensions) {
        return extensions.filter(e => e.labels && e.labels[key]).map(e => e.labels[key]);
    }
}
import Extensions from "../utils/extensions";

export default class LocatorCollector {
    constructor(extensions = [], defaultOptions = []) {
       this.extensions = extensions;
       this.defaultOptions = defaultOptions
    }

    getLocator(locator) {
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

    getLocators(target) {
        let extensions = this.extensions;
        let locators = [];
        let labels = Extensions.labels(extensions);
        let options = Extensions.options(extensions);

        if (labels[target.label]) {
            if (labels[target.label].locate) {
                locators = this.getLocator(labels[target.label].locate)
            }
            else {
                locators = this.getLocator(labels[target.label])
            }
        }

        target.options.forEach(name => {
            if (options[name] && options[name].locate) {
                locators = locators.concat(this.getLocator(options[name].locate))
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

        return locators.length > 0 ? locators : this.getDefaultLocators();
    }

    getDefaultLocators() {
        let extensions = this.extensions;
        let defaultOptions = this.defaultOptions;
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

    getBeforeLocateFromLabels(label) {
        let extensions = this.extensions;
        return this.getExtensionLabels(label, extensions).filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    getAfterLocateFromLabels(label) {
        let extensions = this.extensions;
        return this.getExtensionLabels(label, extensions).filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    getBeforeLocate() {
        let extensions = this.extensions;
        return extensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    getAfterLocate() {
        let extensions = this.extensions;
        return extensions.filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    getExtensionLabels(key) {
        let extensions = this.extensions;
        return extensions.filter(e => e.labels && e.labels[key]).map(e => e.labels[key]);
    }
}
export default class Modifiers {
    static labels(extensions) {
        return extensions.filter(e => e.labels).reduce((m, e) => Object.assign({}, m, e.labels), {});
    }

    static properties(extensions) {
        return extensions.filter(e => e.properties).reduce((m, e) => Object.assign({}, m, e.properties), {});
    }

    static getLocators(target, extensions) {
        let locators = [];
        let labels = Modifiers.labels(extensions);
        let properties = Modifiers.properties(extensions);

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
        let properties = Modifiers.properties(extensions);

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
        return Modifiers.locatorForLabel(label, extensions).filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static locateAfterFromLabel(label, extensions) {
        return Modifiers.locatorForLabel(label, extensions).filter(e => e.afterLocate).map(e => e.afterLocate);
    }

    static beforeLocate(extensions) {
        return extensions.filter(e => e.beforeLocate).map(e => e.beforeLocate);
    }

    static afterLocate(extensions) {
        return extensions.filter(e => e.afterLocate).map(e => e.afterLocate);
    }
}
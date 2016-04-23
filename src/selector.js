import defaultGuide from "./guides/search-lineage"
import defaultLocator from "./locators/default"
import Parser from "./parser";
import log from "./logger";
import mergeObjects from "./utils/merge-objects";

function GlanceSelector(options) {
    let _selector = {};
    _selector.customLabels = options.customLabels || {};
    _selector.modifiers = options.modifiers || {};

    _selector.guideFactory = options.guideFactory;

    let selector = function(reference) {
        let data = Parser.parse(reference);

        let resolvedLabels = resolveCustomLabels(data, _selector.customLabels, _selector);
        let elements = _selector.guideFactory({
            locator: defaultLocator,
            modifiers: _selector.modifiers
        }).search(data, document, 0, resolvedLabels);

        if (elements.length === 1)
            return elements[0];
        else
            return elements;
    };

    selector.addCustomLabels = function(customLabels) {
        _selector.customLabels = mergeObjects(_selector.customLabels, customLabels);
    };

    selector.addModifiers = function(modifiers) {
        _selector.modifiers = mergeObjects(_selector.modifiers, modifiers);
    };

    selector.setLogLevel = function(level) {
        log.setLogLevel(level)
    };

    return selector;
}

function resolveCustomLabels(data, customLabels, selector) {
    let newCustomLabels = {};
    data.forEach(function(reference) {
        let customLabel = customLabels[reference.label];
        if (typeof(customLabel) == 'function') {
            newCustomLabels[reference.label] = customLabel(GlanceSelector({
                guideFactory: selector.guideFactory,
                customLabels: mergeObjects(customLabels, newCustomLabels)
            }), reference);
        }
        else {
            newCustomLabels[reference.label] = customLabels[reference.label]
        }
    });

    return newCustomLabels;
}

export {Parser};
export default GlanceSelector({guideFactory: (config) => new defaultGuide(config)});
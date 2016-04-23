import defaultGuide from "./guides/search-lineage"
import defaultLocator from "./locators/default"
import * as Parser from "./parser";
import log from "./logger";

function mergeOptions(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
}

function GlanceSelector(options) {
    var _selector = {};
    _selector.customLabels = options.customLabels || {};
    _selector.modifiers = options.modifiers || {};
    
    _selector.guideFactory = options.guideFactory;

    var selector = function (reference) {
        var data = Parser.parse(reference);
        
        var resolvedLabels = resolveCustomLabels(data, _selector.customLabels, _selector);
        var elements = _selector.guideFactory({locator: defaultLocator, modifiers:_selector.modifiers}).search(data, document, 0, resolvedLabels);

        if (elements.length === 1)
            return elements[0];
        else
            return elements;
    }

    selector.addCustomLabels = function (customLabels) {
        _selector.customLabels = mergeOptions(_selector.customLabels, customLabels);
    }

    selector.addModifiers = function (modifiers) {
        _selector.modifiers = mergeOptions(_selector.modifiers, modifiers);
    }

    selector.setLogLevel = function (level) {
        log.setLogLevel(level)
    }

    return selector;
}

function resolveCustomLabels(data, customLabels, selector) {
    var newCustomLabels = {};
    data.forEach(function (reference) {
        var customLabel = customLabels[reference.label];
        if (typeof(customLabel) == 'function') {
            newCustomLabels[reference.label] = customLabel(GlanceSelector({
                guideFactory: selector.guideFactory,
                customLabels: mergeOptions(customLabels, newCustomLabels)
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
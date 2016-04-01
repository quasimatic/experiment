import DefaultContainerStrategy from "./scope-strategies/discover-parent"
import defaultFindStrategies from "./find-strategies/default"
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
    
    _selector.containerStrategyFactory = options.containerStrategyFactory;

    var selector = function (reference) {
        var data = Parser.parse(reference);
        
        var resolvedLabels = resolveCustomLabels(data, _selector.customLabels, _selector);
        var elements = _selector.containerStrategyFactory({findStrategy: defaultFindStrategies, modifiers:_selector.modifiers}).search(data, document, 0, resolvedLabels);

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
                containerStrategyFactory: selector.containerStrategyFactory,
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

export default GlanceSelector({containerStrategyFactory: (config) => new DefaultContainerStrategy(config)});
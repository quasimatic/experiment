import DefaultContainerStrategy from "./container-strategies/discover-parent"
import defaultFindStrategies from "./find-strategies/default"
import parser from "./parser";
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
    _selector.containerStrategy = options.containerStrategy;

    var selector = function (reference) {
        var data = parser.parse(reference);

        var resolvedLabels = resolveCustomLabels(data, _selector.customLabels, _selector);
        var elements = _selector.containerStrategy.search(data.containers, document, 0, resolvedLabels);

        if (elements.length === 1)
            return elements[0];
        else
            return elements;
    }

    selector.addCustomLabels = function (customLabels) {
        console.log(customLabels)
        _selector.customLabels = mergeOptions(_selector.customLabels, customLabels);
    }

    selector.setLogLevel = function (level) {
        log.setLogLevel(level)
    }

    return selector;
}

function resolveCustomLabels(data, customLabels, selector) {
    var newCustomLabels = {};
    data.containers.forEach(function (reference) {
        var customLabel = customLabels[reference.label];
        if (typeof(customLabel) == 'function') {

            newCustomLabels[reference.label] = customLabel(GlanceSelector({
                containerStrategy: selector.containerStrategy,
                customLabels: mergeOptions(customLabels, newCustomLabels)
            }), reference);
        }
        else {
            newCustomLabels[reference.label] = customLabels[reference.label]
        }
    });

    return newCustomLabels;
}

var defaultContainerStrategy = new DefaultContainerStrategy(defaultFindStrategies);

export default GlanceSelector({containerStrategy: defaultContainerStrategy});
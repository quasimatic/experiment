"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _discoverParent = require("./container-strategies/discover-parent");

var _discoverParent2 = _interopRequireDefault(_discoverParent);

var _default = require("./find-strategies/default");

var _default2 = _interopRequireDefault(_default);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    var selector = function selector(reference) {
        var data = _parser2.default.parse(reference);

        var resolvedLabels = resolveCustomLabels(data, _selector.customLabels, _selector);
        var elements = _selector.containerStrategy.search(data.containers, document, 0, resolvedLabels);

        if (elements.length === 1) return elements[0];else return elements;
    };

    selector.addCustomLabels = function (customLabels) {
        _selector.customLabels = mergeOptions(_selector.customLabels, customLabels);
    };

    selector.setLogLevel = function (level) {
        _logger2.default.setLogLevel(level);
    };

    return selector;
}

function resolveCustomLabels(data, customLabels, selector) {
    var newCustomLabels = {};
    data.containers.forEach(function (reference) {
        var customLabel = customLabels[reference.label];
        if (typeof customLabel == 'function') {

            newCustomLabels[reference.label] = customLabel(GlanceSelector({
                containerStrategy: selector.containerStrategy,
                customLabels: mergeOptions(customLabels, newCustomLabels)
            }), reference);
        } else {
            newCustomLabels[reference.label] = customLabels[reference.label];
        }
    });

    return newCustomLabels;
}

var defaultContainerStrategy = new _discoverParent2.default(_default2.default);

exports.default = GlanceSelector({ containerStrategy: defaultContainerStrategy });
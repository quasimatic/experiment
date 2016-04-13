"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Parser = undefined;

var _discoverParent = require("./scope-strategies/discover-parent");

var _discoverParent2 = _interopRequireDefault(_discoverParent);

var _default = require("./locators/default");

var _default2 = _interopRequireDefault(_default);

var _parser = require("./parser");

var Parser = _interopRequireWildcard(_parser);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
    _selector.modifiers = options.modifiers || {};

    _selector.containerStrategyFactory = options.containerStrategyFactory;

    var selector = function selector(reference) {
        var data = Parser.parse(reference);

        var resolvedLabels = resolveCustomLabels(data, _selector.customLabels, _selector);
        var elements = _selector.containerStrategyFactory({ locator: _default2.default, modifiers: _selector.modifiers }).search(data, document, 0, resolvedLabels);

        if (elements.length === 1) return elements[0];else return elements;
    };

    selector.addCustomLabels = function (customLabels) {
        _selector.customLabels = mergeOptions(_selector.customLabels, customLabels);
    };

    selector.addModifiers = function (modifiers) {
        _selector.modifiers = mergeOptions(_selector.modifiers, modifiers);
    };

    selector.setLogLevel = function (level) {
        _logger2.default.setLogLevel(level);
    };

    return selector;
}

function resolveCustomLabels(data, customLabels, selector) {
    var newCustomLabels = {};
    data.forEach(function (reference) {
        var customLabel = customLabels[reference.label];
        if (typeof customLabel == 'function') {
            newCustomLabels[reference.label] = customLabel(GlanceSelector({
                containerStrategyFactory: selector.containerStrategyFactory,
                customLabels: mergeOptions(customLabels, newCustomLabels)
            }), reference);
        } else {
            newCustomLabels[reference.label] = customLabels[reference.label];
        }
    });

    return newCustomLabels;
}

exports.Parser = Parser;
exports.default = GlanceSelector({ containerStrategyFactory: function containerStrategyFactory(config) {
        return new _discoverParent2.default(config);
    } });
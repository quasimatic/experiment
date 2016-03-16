"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GlanceSelector = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _discoverParent = require("./container-strategies/discover-parent");

var _discoverParent2 = _interopRequireDefault(_discoverParent);

var _default = require("./find-strategies/default");

var _default2 = _interopRequireDefault(_default);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultContainerStrategy = new _discoverParent2.default(_default2.default);

var GlanceSelector = exports.GlanceSelector = function () {
    function GlanceSelector(options) {
        _classCallCheck(this, GlanceSelector);

        this.containerStrategy = options.containerStrategy;
        this.findStrategy = options.findStrategy;
        this.customLabels = options.customLabels;
    }

    _createClass(GlanceSelector, [{
        key: "find",
        value: function find(selector, customLabels) {
            var data = _parser2.default.parse(selector);
            this.containerStrategy.customLabels = customLabels;
            var elements = this.containerStrategy.search(data.containers, document);

            if (elements.length === 1) return elements[0];else return elements;
        }
    }]);

    return GlanceSelector;
}();

var selector = function selector(_selector, customLabels) {
    return new GlanceSelector({
        containerStrategy: defaultContainerStrategy,
        findStrategy: _default2.default
    }).find(_selector, customLabels);
};

selector.setLogLevel = function (level) {
    _logger2.default.setLogLevel(level);
};

exports.default = selector;
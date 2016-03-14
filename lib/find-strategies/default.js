"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container, customLabels) {
    _logger2.default.debug("Searching by custom label:", label);
    var e = (0, _customLabel2.default)(label, container, customLabels || {});
    if (e.length > 0) {
        _logger2.default.info("Matched using custom label:", label);
        return e;
    }

    _logger2.default.debug("Searching for exact text:", label);
    e = (0, _exactText2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using exact text:", label);
        return e;
    }

    _logger2.default.debug("Searching for text that contains:", label);
    e = (0, _containsText2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using contains text:", label);
        return e;
    }

    _logger2.default.debug("Searching by id:", label);
    e = (0, _id2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using ID:", label);
        return e;
    }

    _logger2.default.debug("Searching for css class:", label);
    e = (0, _className2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using css class:", label);
        return e;
    }

    _logger2.default.debug("Searching by node type:", label);
    e = (0, _nodeType2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using node type:", label);
        return e;
    }

    return e;
};

var _logger = require("../logger");

var _logger2 = _interopRequireDefault(_logger);

var _customLabel = require("./custom-label");

var _customLabel2 = _interopRequireDefault(_customLabel);

var _exactText = require("./exact-text");

var _exactText2 = _interopRequireDefault(_exactText);

var _containsText = require("./contains-text");

var _containsText2 = _interopRequireDefault(_containsText);

var _id = require("./id");

var _id2 = _interopRequireDefault(_id);

var _className = require("./class-name");

var _className2 = _interopRequireDefault(_className);

var _nodeType = require("./node-type");

var _nodeType2 = _interopRequireDefault(_nodeType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
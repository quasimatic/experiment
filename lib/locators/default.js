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

    _logger2.default.debug("Searching in name:", label);
    e = (0, _name2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using name:", label);
        return e;
    }

    _logger2.default.debug("Searching in value:", label);
    e = (0, _value2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using value:", label);
        return e;
    }

    _logger2.default.debug("Searching in placeholder:", label);
    e = (0, _placeholder2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using placeholder:", label);
        return e;
    }

    _logger2.default.debug("Searching for image alt:", label);
    e = (0, _image2.default)(label, container);
    if (e.length > 0) {
        _logger2.default.info("Matched using image alt:", label);
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

var _containsText = require("./contains-text");

var _containsText2 = _interopRequireDefault(_containsText);

var _id = require("./id");

var _id2 = _interopRequireDefault(_id);

var _className = require("./class-name");

var _className2 = _interopRequireDefault(_className);

var _name = require("./name");

var _name2 = _interopRequireDefault(_name);

var _value = require("./value");

var _value2 = _interopRequireDefault(_value);

var _placeholder = require("./placeholder");

var _placeholder2 = _interopRequireDefault(_placeholder);

var _image = require("./image");

var _image2 = _interopRequireDefault(_image);

var _nodeType = require("./node-type");

var _nodeType2 = _interopRequireDefault(_nodeType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
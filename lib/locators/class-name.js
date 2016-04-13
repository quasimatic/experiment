"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container) {
    try {
        return (0, _css2.default)("." + label, container);
    } catch (e) {
        return [];
    }
};

var _css = require("./css");

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
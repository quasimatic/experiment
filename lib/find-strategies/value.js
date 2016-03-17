"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container) {
    return (0, _css2.default)("input", container).filter(function (input) {
        return input.value && input.value.toLowerCase() === label.toLowerCase();
    });
};

var _css = require("../../src/find-strategies/css");

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
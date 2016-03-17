"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container) {
    return (0, _css2.default)("button,input,option,param", container).filter(function (input) {
        return input.value && input.value.toLowerCase().indexOf(label.toLowerCase()) != -1;
    });
};

var _css = require("../../src/find-strategies/css");

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
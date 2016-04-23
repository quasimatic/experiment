"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container) {
    return (0, _xpath2.default)(".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container);
};

var _xpath = require("./xpath");

var _xpath2 = _interopRequireDefault(_xpath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
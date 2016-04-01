"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    "visible": {
        implicit: true,
        filter: function filter(elements) {
            return elements.filter(function (e) {
                return e.tagName.toLowerCase() == "option" || e.offsetParent;
            });
        }
    }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container) {
    try {
        var results = container.querySelectorAll(label);

        return Array.prototype.slice.apply(results);
    } catch (e) {
        return [];
    }
};
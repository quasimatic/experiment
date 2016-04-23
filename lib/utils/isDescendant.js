"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};

;
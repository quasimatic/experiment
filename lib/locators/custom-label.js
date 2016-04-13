'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container, customLabels) {
    customLabels = customLabels || {};
    var resolver = customLabels[label];

    var elements = resolver;
    if (typeof elements == 'function') {
        elements = resolver();
    }

    if (!elements) return [];

    elements = [].concat(elements);

    try {
        var r = [];
        elements.forEach(function (e) {
            if (isDescendant(container, e)) {
                r.push(e);
            }
        });

        return r;
    } catch (e) {
        return [];
    }
};

var isDescendant = function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};
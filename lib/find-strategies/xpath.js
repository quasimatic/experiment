"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (label, container) {
    try {
        var results = [];

        var xpathResult = document.evaluate(label, container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            results.push(xpathResult.snapshotItem(i));
        }

        return results;
    } catch (err) {
        return [];
    }
};
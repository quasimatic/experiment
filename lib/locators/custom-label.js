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
            if ((0, _isDescendant2.default)(container, e)) {
                r.push(e);
            }
        });

        return r;
    } catch (e) {
        return [];
    }
};

var _isDescendant = require('../utils/isDescendant');

var _isDescendant2 = _interopRequireDefault(_isDescendant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
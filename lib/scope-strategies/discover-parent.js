"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nthFilter = require("../position-filters/nth-filter");

var _nthFilter2 = _interopRequireDefault(_nthFilter);

var _visible = require("../modifiers/visible");

var _visible2 = _interopRequireDefault(_visible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function mergeOptions(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
}

var DiscoverParentContainer = function () {
    function DiscoverParentContainer(config) {
        _classCallCheck(this, DiscoverParentContainer);

        this.findStrategy = config.findStrategy;
        this.modifiers = config.modifiers || {};

        this.modifiers = mergeOptions(this.modifiers, _visible2.default);

        this.customLabels = {};
    }

    _createClass(DiscoverParentContainer, [{
        key: "search",
        value: function search(targets, context, labelIndex, customLabels) {
            var _this = this;

            labelIndex = labelIndex || 0;
            var target = targets[labelIndex];

            var elements = [];

            var parent = context;

            var findStrategy = this.findStrategy;

            if (target.modifiers.length > 0) {
                var modifierNames = target.modifiers.filter(function (m) {
                    return _this.modifiers[m].find;
                });
                if (modifierNames.length > 0) findStrategy = this.modifiers[modifierNames[0]].find;
            }

            while (parent && elements.length == 0) {
                elements = findStrategy(target.label, parent, customLabels);
                parent = parent.parentNode;
            }

            elements = this._limitToScope(elements, context);
            elements = this._limitToNextSibling(elements, context);

            if (target.modifiers.length > 0) {
                elements = target.modifiers.reduce(function (previousValue, modifierName) {
                    var modifier = _this.modifiers[modifierName];
                    if (typeof modifier != 'undefined') {
                        if (Object.keys(_this.modifiers).filter(function (k) {
                            return _this.modifiers[k].override == modifierName;
                        }).length == 0) {
                            var filter = modifier.filter || function () {
                                return previousValue;
                            };
                            return filter(previousValue);
                        }

                        return previousValue;
                    }
                }, elements);
            } else {
                elements = Object.keys(this.modifiers).reduce(function (previousValue, modifierName) {
                    var modifier = _this.modifiers[modifierName];
                    if (typeof modifier != 'undefined' && modifier.default) {
                        if (Object.keys(_this.modifiers).filter(function (k) {
                            return _this.modifiers[k].override == modifierName;
                        }).length == 0) {
                            var filter = modifier.filter || function () {
                                return previousValue;
                            };
                            return filter(previousValue);
                        }
                    }

                    return previousValue;
                }, elements);
            }

            var filteredElements = (0, _nthFilter2.default)(elements, target.position);
            if (this._lastItem(targets, labelIndex)) {
                return filteredElements;
            } else {
                // IS a container
                var newTargets = [];

                for (var c = 0; c < filteredElements.length; c++) {
                    var childContainer = filteredElements[c];
                    var foundItems = this.search(targets, childContainer, labelIndex + 1, customLabels);
                    newTargets = newTargets.concat(foundItems);
                }

                return this._unique(newTargets);
            }
        }
    }, {
        key: "_lastItem",
        value: function _lastItem(targets, labelIndex) {
            return labelIndex + 1 === targets.length;
        }
    }, {
        key: "_limitToScope",
        value: function _limitToScope(elements, scope) {
            var elementContainsContainer = false;
            var parentsContainingReference = [];
            for (var e = 0; e < elements.length; ++e) {
                if (this._isDescendant(elements[e], scope)) {
                    elementContainsContainer = true;
                    parentsContainingReference.push(elements[e]);
                }
            }

            if (elementContainsContainer) return parentsContainingReference;

            return elements;
        }
    }, {
        key: "_limitToNextSibling",
        value: function _limitToNextSibling(elements, scope) {
            var siblings = elements.filter(function (e) {
                return scope && scope.nextElementSibling == e;
            });

            return siblings.length == 0 ? elements : siblings;
        }
    }, {
        key: "_unique",
        value: function _unique(array) {
            return array.filter(function (x, i) {
                return array.indexOf(x) === i;
            });
        }
    }, {
        key: "_isDescendant",
        value: function _isDescendant(parent, child) {
            var node = child.parentNode;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
    }]);

    return DiscoverParentContainer;
}();

exports.default = DiscoverParentContainer;
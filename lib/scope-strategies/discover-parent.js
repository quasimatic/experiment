"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nthFilter = require("../position-filters/nth-filter");

var _nthFilter2 = _interopRequireDefault(_nthFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DiscoverParentContainer = function () {
    function DiscoverParentContainer(searcher) {
        _classCallCheck(this, DiscoverParentContainer);

        this.findElement = searcher;
        this.customLabels = {};
    }

    _createClass(DiscoverParentContainer, [{
        key: "search",
        value: function search(targets, context, labelIndex, customLabels) {
            labelIndex = labelIndex || 0;
            var target = targets[labelIndex];

            var elements = [];

            var parent = context;

            while (parent && elements.length == 0) {
                elements = this.findElement(target.label, parent, customLabels);
                parent = parent.parentNode;
            }

            elements = this._limitToVisible(elements);
            elements = this._limitToScope(elements, context);
            elements = this._limitToNextSibling(elements, context);

            var lastItem = labelIndex + 1 === targets.length;

            var filteredElements = (0, _nthFilter2.default)(elements, target.position);
            if (lastItem) {
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
        key: "_limitToVisible",
        value: function _limitToVisible(elements) {
            return elements.filter(function (e) {
                return e.tagName.toLowerCase() == "option" || e.offsetParent;
            });
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
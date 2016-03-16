"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DiscoverParentContainer = function () {
    function DiscoverParentContainer(searcher) {
        _classCallCheck(this, DiscoverParentContainer);

        this.findElement = searcher;
    }

    _createClass(DiscoverParentContainer, [{
        key: "search",
        value: function search(targets, context, labelIndex) {
            labelIndex = labelIndex || 0;
            var target = targets[labelIndex];
            var i = target.position - 1;

            var elements = [];

            var parent = context;

            while (parent && elements.length == 0) {
                elements = this.findElement(target.label, parent, this.customLabels);
                parent = parent.parentNode;
            }

            elements = this._limitToReferences(elements, context);

            var lastItem = labelIndex + 1 === targets.length;
            if (lastItem) {
                if (i >= 0) {
                    if (!elements[i]) return [];

                    return [].concat(elements[i]);
                }

                return elements;
            } else {
                // IS a container
                var newTargets = [];

                if (i >= 0) {
                    var childContainer = elements[i];
                    var foundItems = this.search(targets, childContainer, labelIndex + 1);
                    newTargets = newTargets.concat(foundItems);
                } else {
                    for (var c = 0; c < elements.length; c++) {
                        var childContainer = elements[c];
                        console.log(childContainer);
                        var foundItems = this.search(targets, childContainer, labelIndex + 1);
                        newTargets = newTargets.concat(foundItems);
                    }
                }

                return this._unique(newTargets);
            }
        }
    }, {
        key: "_limitToReferences",
        value: function _limitToReferences(elements, container) {
            var elementContainsContainer = false;
            var parentsContainingReference = [];
            for (var e = 0; e < elements.length; ++e) {
                if (this._isDescendant(elements[e], container)) {
                    elementContainsContainer = true;
                    parentsContainingReference.push(elements[e]);
                }
            }

            if (elementContainsContainer) return parentsContainingReference;

            return elements;
        }
    }, {
        key: "_unique",
        value: function _unique(array) {
            var u = {},
                a = [];
            for (var i = 0, l = array.length; i < l; ++i) {
                if (u.hasOwnProperty(array[i])) {
                    continue;
                }
                a.push(array[i]);
                u[array[i]] = 1;
            }
            return a;
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
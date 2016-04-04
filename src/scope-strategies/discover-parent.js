import nthFilter from "../position-filters/nth-filter";
import visibleModifier from "../modifiers/visible";

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

export default class DiscoverParentContainer {
    constructor(config) {
        this.findStrategy = config.findStrategy;
        this.modifiers = config.modifiers || {};

        this.modifiers = mergeOptions(this.modifiers, visibleModifier)

        this.customLabels = {};
    }

    search(targets, context, labelIndex, customLabels) {
        labelIndex = labelIndex || 0;
        var target = targets[labelIndex];

        var elements = [];

        var parent = context;

        var findStrategy = this.findStrategy;

        if (target.modifiers.length > 0) {
            var modifierNames = target.modifiers.filter(m => this.modifiers[m].find);
            if(modifierNames.length > 0)
                findStrategy = this.modifiers[modifierNames[0]].find;
        }

        while (parent && elements.length == 0) {
            elements = findStrategy(target.label, parent, customLabels);
            parent = parent.parentNode;
        }

        elements = this._limitToScope(elements, context);
        elements = this._limitToNextSibling(elements, context);

        if (target.modifiers.length > 0) {
            elements = target.modifiers.reduce((previousValue, modifierName) => {
                var modifier = this.modifiers[modifierName];
                if (typeof(modifier) != 'undefined') {
                    if (Object.keys(this.modifiers).filter(k => this.modifiers[k].override == modifierName).length == 0) {
                        var filter = modifier.filter || (() => previousValue);
                        return filter(previousValue)
                    }

                    return previousValue;
                }
            }, elements)
        }
        else {
            elements = Object.keys(this.modifiers).reduce((previousValue, modifierName) => {
                var modifier = this.modifiers[modifierName];
                if (typeof(modifier) != 'undefined' && modifier.default) {
                    if (Object.keys(this.modifiers).filter(k => this.modifiers[k].override == modifierName).length == 0) {
                        var filter = modifier.filter || (()=> previousValue);
                        return filter(previousValue)
                    }
                }

                return previousValue;
            }, elements)
        }
        
        var filteredElements = nthFilter(elements, target.position);
        if (this._lastItem(targets, labelIndex)) {
            return filteredElements;
        }
        else {
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

    _lastItem(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
    
    _limitToScope(elements, scope) {
        var elementContainsContainer = false;
        var parentsContainingReference = [];
        for (var e = 0; e < elements.length; ++e) {
            if (this._isDescendant(elements[e], scope)) {
                elementContainsContainer = true;
                parentsContainingReference.push(elements[e]);
            }
        }

        if (elementContainsContainer)
            return parentsContainingReference;

        return elements;
    }

    _limitToNextSibling(elements, scope) {
        var siblings = elements.filter(function (e) {
            return scope && scope.nextElementSibling == e;
        });

        return siblings.length == 0 ? elements : siblings;
    }

    _unique(array) {
        return array.filter(function (x, i) {
            return array.indexOf(x) === i
        })
    }

    _isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}
import nthFilter from "../position-filters/nth-filter";
import visibleModifier from "../modifiers/visible";
import isDescendant from '../utils/isDescendant';
import mergeObjects from '../utils/merge-objects';

export default class SearchLineage {
    constructor(config) {
        this.locator = config.locator;
        this.modifiers = config.modifiers || {};

        this.modifiers = mergeObjects(this.modifiers, visibleModifier)

        this.customLabels = {};
    }

    search(targets, context, labelIndex, customLabels) {
        labelIndex = labelIndex || 0;
        var target = targets[labelIndex];

        var elements = [];

        var parent = context;

        var locator = this.locator;

        if (target.modifiers.length > 0) {
            var modifierNames = target.modifiers.filter(m => this.modifiers[m].find);
            if(modifierNames.length > 0)
                locator = this.modifiers[modifierNames[0]].find;
        }

        while (parent && elements.length == 0) {
            elements = locator(target.label, parent, customLabels);
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
            if (isDescendant(elements[e], scope)) {
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
}
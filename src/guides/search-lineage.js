import nthFilter from "../position-filters/nth-filter";
import visibleModifier from "../modifiers/visible";
import isDescendant from '../utils/is-descendant';
import mergeObjects from '../utils/merge-objects';

export default class SearchLineage {
    constructor(config) {
        this.locator = config.locator;
        this.modifiers = config.modifiers || {};

        this.modifiers = mergeObjects(this.modifiers, visibleModifier);

        this.customLabels = {};
    }

    search(targets, context, labelIndex, customLabels) {
        labelIndex = labelIndex || 0;
        let target = targets[labelIndex];

        let elements = [];

        let parent = context;

        let locator = this.locator;

        if (target.modifiers.length > 0) {
            let modifierNames = target.modifiers.filter(m => this.modifiers[m].find);
            if (modifierNames.length > 0)
                locator = this.modifiers[modifierNames[0]].find;
        }

        while (parent && elements.length == 0) {
            elements = locator(target.label, parent, customLabels);
            parent = parent.parentNode;
        }

        elements = SearchLineage._limitToScope(elements, context);
        elements = SearchLineage._limitToNextSibling(elements, context);

        if (target.modifiers.length > 0) {
            elements = target.modifiers.reduce((previousValue, modifierName) => {
                let modifier = this.modifiers[modifierName];
                if (typeof(modifier) != 'undefined') {
                    let filter = modifier.filter || (() => previousValue);
                    return filter(previousValue)
                }

                return previousValue;
            }, elements)
        }
        else {
            elements = Object.keys(this.modifiers).reduce((previousValue, modifierName) => {
                let modifier = this.modifiers[modifierName];
                if (typeof(modifier) != 'undefined' && modifier.default) {
                    let filter = modifier.filter || (()=> previousValue);
                    return filter(previousValue)
                }

                return previousValue;
            }, elements)
        }

        let filteredElements = nthFilter(elements, target.position);
        if (SearchLineage._lastItem(targets, labelIndex)) {
            return filteredElements;
        }
        else {
            // IS a container
            let newTargets = [];

            for (let c = 0; c < filteredElements.length; c++) {
                let childContainer = filteredElements[c];
                let foundItems = this.search(targets, childContainer, labelIndex + 1, customLabels);
                newTargets = newTargets.concat(foundItems);
            }

            return this._unique(newTargets);
        }
    }

    static _lastItem(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }

    static _limitToScope(elements, scope) {
        let elementContainsContainer = false;
        let parentsContainingReference = [];
        for (let e = 0; e < elements.length; ++e) {
            if (isDescendant(elements[e], scope)) {
                elementContainsContainer = true;
                parentsContainingReference.push(elements[e]);
            }
        }

        if (elementContainsContainer)
            return parentsContainingReference;

        return elements;
    }

    static _limitToNextSibling(elements, scope) {
        let siblings = elements.filter(function(e) {
            return scope && scope.nextElementSibling == e;
        });

        return siblings.length == 0 ? elements : siblings;
    }

    _unique(array) {
        return array.filter(function(x, i) {
            return array.indexOf(x) === i
        })
    }
}
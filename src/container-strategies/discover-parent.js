export default class DiscoverParentContainer {
    constructor(searcher) {
        this.findElement = searcher;
        this.customLabels = {};
    }

    search(targets, context, labelIndex, customLabels) {
        labelIndex = labelIndex || 0;
        var target = targets[labelIndex];
        var i = target.position - 1;

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
        if (lastItem) {
            if (i >= 0) {
                if (!elements[i])
                    return [];

                return [].concat(elements[i]);
            }

            return elements;
        }
        else {
            // IS a container
            var newTargets = [];

            if (i >= 0) {
                var childContainer = elements[i];
                var foundItems = this.search(targets, childContainer, labelIndex + 1, customLabels);
                newTargets = newTargets.concat(foundItems);
            }
            else {
                for (var c = 0; c < elements.length; c++) {
                    var childContainer = elements[c];
                    var foundItems = this.search(targets, childContainer, labelIndex + 1, customLabels);
                    newTargets = newTargets.concat(foundItems);
                }
            }

            return this._unique(newTargets);
        }
    }

    _limitToVisible(elements) {
        return elements.filter(e => e.tagName.toLowerCase() == "option" || e.offsetParent);
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
        var siblings = elements.filter(function(e){
            return scope && scope.nextElementSibling == e;
        });

        return siblings.length == 0? elements : siblings;
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
export default class DiscoverParentContainer {
    constructor(searcher) {
        this.searcher = searcher;
    }

    search(targets, context, labelIndex) {
        var target = targets[labelIndex];
        var i = target.position - 1;

        var elements = this.searcher(target.label, context, this.customLabels);

        elements = this._limitToReferences(elements, context);

        var lastItem = labelIndex + 1 === targets.length;
        if (lastItem) {
            if (i > 0) {
                if (!elements[i]) return [];

                return [elements[i]];
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
                    var foundItems = this.search(targets, childContainer, labelIndex + 1);
                    newTargets = newTargets.concat(foundItems);
                }
            }

            return this._unique(newTargets);
        }
    }

    _limitToReferences(elements, container) {
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

    _unique(array) {
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
var isDescendant = function (parent, child) {
    let node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};

export default function (label, container, customLabels) {
    customLabels = customLabels || {};
    let resolver = customLabels[label];

    let elements = resolver;
    if(typeof(elements) == 'function') {
       elements = resolver();
    }

    if (!elements) return [];

    elements = [].concat(elements);

    try {
        var r = [];
        elements.forEach(function(e){
            if (isDescendant(container, e)) {
                r.push(e)
            }
        });

        return r;
    }
    catch (e) {
        return [];
    }
}
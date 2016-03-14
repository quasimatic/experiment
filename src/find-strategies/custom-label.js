var isDescendant = function (parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};

export default function (text, container, customLabels) {
    var target = customLabels[text];
    if (!target) return [];

    try {
        var r = [];
        var xpathResult = document.evaluate(customLabel, document.querySelector("body"), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if (xpathResult.snapshotLength > 0) {
            for (var i = 0; i < xpathResult.snapshotLength; ++i) {
                var e = xpathResult.snapshotItem(i);

                if (isDescendant(container, e)) {
                    r.push(e)
                }
            }
        }

        return r;
    }
    catch (e) {
        return [];
    }
}

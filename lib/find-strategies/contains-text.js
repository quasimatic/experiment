export default function (label, container) {
    try {
        var results = [];

        var xpathResult = document.evaluate(".//*[not(self::script) and contains(text(),'" + label + "')]", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            results.push(xpathResult.snapshotItem(i));
        }

        return results;
    } catch (err) {
        return [];
    }
}
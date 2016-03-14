export default function (target, container) {
    try {
        var xpathResult = document.evaluate(".//*[not(self::script) and text()='" + target + "']", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var results = [];
        
        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            results.push(xpathResult.snapshotItem(i));
        }

        return results;
    }
    catch(err) {
        return [];
    }
}

export default function(label, container) {
    try {
        let xpathResult = document.evaluate(".//*[not(self::script) and text()='" + label + "']", container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let results = [];

        for (let i = 0; i < xpathResult.snapshotLength; i++) {
            results.push(xpathResult.snapshotItem(i));
        }

        return results;
    }
    catch (err) {
        return [];
    }
}

export default function(label, scopeElement, resultHandler) {
    try {
        let results = [];

        let xpathResult = document.evaluate(label, scopeElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < xpathResult.snapshotLength; i++) {
            results.push(xpathResult.snapshotItem(i));
        }

        return resultHandler(null, results);
    }
    catch (err) {
        return resultHandler(err, []);
    }
}
import browserExecute from '../../browser-execute'

export default function (label, scopeElement, resultHandler) {
    return browserExecute(function (label, scopeElement, handler) {
        var results = [];

        var xpathResult = document.evaluate(label, scopeElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            results.push(xpathResult.snapshotItem(i));
        }

        return handler(null, results);
    }, label, scopeElement, (err, result) => {
        return resultHandler(null, result);
    });
}
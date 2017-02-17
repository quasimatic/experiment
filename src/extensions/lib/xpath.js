import browserExecute from '../../browser-execute'

export default function (label, containerElement, resultHandler) {
    return browserExecute(function (label, containerElement, handler) {
        var results = [];

        var xpathResult = document.evaluate(label, containerElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < xpathResult.snapshotLength; i++) {
            results.push(xpathResult.snapshotItem(i));
        }

        return handler(null, results);
    }, label, containerElement, (err, result) => {
        return resultHandler(null, result);
    });
}
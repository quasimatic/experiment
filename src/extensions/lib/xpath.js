export default function(label, scopeElement, resultHandler) {
    try {
        return browserExecute(function(label, scopeElement, handler){
            var results = [];

            var xpathResult = document.evaluate(label, scopeElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (var i = 0; i < xpathResult.snapshotLength; i++) {
                results.push(xpathResult.snapshotItem(i));
            }

            return handler(null, results);
        }, label, scopeElement, (err, result)=>{
            if(err)
                return resultHandler(err, []);

            return resultHandler(null, result);
        });
    }
    catch (err) {
        return resultHandler(err, []);
    }
}
export default function (label, scopeElement, resultHandler = (err, result) => result) {
    try {
        return browserExecute(function (label, scopeElement, handler) {
            var results = scopeElement.querySelectorAll(label);
            return handler(null, Array.prototype.slice.apply(results));
        }, label, scopeElement, resultHandler);
    }
    catch (err) {
        return resultHandler(err, []);
    }
}

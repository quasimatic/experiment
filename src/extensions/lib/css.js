export default function (label, scopeElement, resultHandler = (err, result) => result) {
    return browserExecute(function (label, scopeElement, handler) {
        try {
            var results = scopeElement.querySelectorAll(label);
            return handler(null, Array.prototype.slice.apply(results));
        }
        catch(e) {
            if(e instanceof DOMException)
                return handler(null, []);
            else
                return handler(e, []);
        }
    }, label, scopeElement, resultHandler);
}

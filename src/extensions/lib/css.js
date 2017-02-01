import browserExecute from '../../browser-execute'

export default function (label, scopeElement, resultHandler = (err, result) => result) {
    return browserExecute(function (label, scopeElement, handler) {
        try {
            var results = [];

            var matches = (scopeElement.matches || scopeElement.matchesSelector || scopeElement.msMatchesSelector || scopeElement.mozMatchesSelector || scopeElement.webkitMatchesSelector || scopeElement.oMatchesSelector);
            if (matches && matches.call(scopeElement, label))
                results.push(scopeElement);

            results = results.concat(Array.prototype.slice.apply(scopeElement.querySelectorAll(label)));

            return handler(null, results);
        }
        catch (e) {
            if (e instanceof DOMException)
                return handler(null, []);

            throw e;
        }
    }, label, scopeElement, resultHandler);
}

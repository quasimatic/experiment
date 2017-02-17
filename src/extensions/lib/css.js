import browserExecute from '../../browser-execute'

export default function (label, containerElement, resultHandler = (err, result) => result) {
    return browserExecute(function (label, containerElement, handler) {
        try {
            var results = [];

            var matches = (containerElement.matches || containerElement.matchesSelector || containerElement.msMatchesSelector || containerElement.mozMatchesSelector || containerElement.webkitMatchesSelector || containerElement.oMatchesSelector);
            if (matches && matches.call(containerElement, label))
                results.push(containerElement);

            results = results.concat(Array.prototype.slice.apply(containerElement.querySelectorAll(label)));

            return handler(null, results);
        }
        catch (e) {
            if (e instanceof DOMException)
                return handler(null, []);

            throw e;
        }
    }, label, containerElement, resultHandler);
}

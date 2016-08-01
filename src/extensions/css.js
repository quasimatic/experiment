export default function(label, scopeElement, resultHandler = (err, result) => result) {
    try {
        let results = scopeElement.querySelectorAll(label);

        return resultHandler(null, Array.prototype.slice.apply(results));
    }
    catch (err) {
        return resultHandler(err, []);
    }
}

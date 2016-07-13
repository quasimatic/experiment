export default function(label, container, resultHandler = (err, result) => result) {
    try {
        let results = container.querySelectorAll(label);

        return resultHandler(null, Array.prototype.slice.apply(results));
    }
    catch (err) {
        return resultHandler(err, []);
    }
}

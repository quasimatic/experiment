export default function (label, scopeElement, resultHandler = (err, result) => result) {
    try {
        return browserExecute(function (label, scopeElement, handler) {
            var results = scopeElement.querySelectorAll(label);
            return handler(null, Array.prototype.slice.apply(results));
        }, label, scopeElement, (err, result)=> {
            if (err)
                return resultHandler(err, []);

            return resultHandler(err, result);
        });
    }
    catch (err) {
        return resultHandler(err, []);
    }
}

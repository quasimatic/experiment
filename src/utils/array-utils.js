import browserExecute from '../browser-execute'

export function reduce(collection, memo, iteratee, resultHandler) {
    function process(i, collection, memo, iteratee, handler) {
        if (i < collection.length) {
            return iteratee(memo, collection[i], function (err, result) {
                if (err) {
                    return handler(err, memo);
                }

                return process(++i, collection, result, iteratee, handler);
            });
        }

        return handler(null, memo);
    }

    return process(0, collection, memo, iteratee, resultHandler);
}

export function unique(array, resultHandler) {
    return browserExecute(function (array, handler) {
        return handler(null, array.filter(function (x, i) {
            return array.indexOf(x) === i;
        }));
    }, array, resultHandler);
}
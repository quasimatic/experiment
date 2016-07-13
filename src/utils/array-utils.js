export function reduce(collection, memo, iteratee, resultHandler) {
    function process(i, collection, memo, iteratee, handler) {
        if (i < collection.length) {
            return iteratee(memo, collection[i], function(err, result){
                return process(++i, collection, result, iteratee, handler);
            });
        }

        return handler(null, memo);
    }

    return process(0, collection, memo, iteratee, resultHandler);
}

export function unique(array) {
    return array.filter(function(x, i) {
        return array.indexOf(x) === i;
    });
}

export function until(collection, check, resultHandler) {
    function process(i, collection, check, handler) {
        if (i < collection.length) {
            return collection[i]((err, result) => {
                if (check(result)) {
                    return handler(err, result);
                } else {
                    return process(++i, collection, check, handler);
                }
            });
        }

        return handler(null, null);
    }

    return process(0, collection, check, resultHandler);
}
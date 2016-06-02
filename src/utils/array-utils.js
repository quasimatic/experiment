export function reduce(collection, memo, iteratee, callback) {
    function process(i, collection, memo, iteratee, callback) {
        if (i < collection.length) {
            return iteratee(memo, collection[i], function(result){
                return process(++i, collection, result, iteratee, callback);
            });
        }

        return callback(memo);
    }

    return process(0, collection, memo, iteratee, callback);
}

export function unique(array) {
    return array.filter(function(x, i) {
        return array.indexOf(x) === i;
    });
}

export function until(collection, check, resultHandler) {
    function process(i, collection, check, handler) {
        if (i < collection.length) {
            return collection[i]((result) => {
                if (check(result)) {
                    return handler(result);
                } else {
                    return process(++i, collection, check, handler);
                }
            });
        }

        return handler(null);
    }

    return process(0, collection, check, resultHandler);
}
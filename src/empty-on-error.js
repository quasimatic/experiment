export default function (handler) {
    return function (err, result) {
        if (err) {
            return handler(err, []);
        }

        return handler(err, result);
    }
}
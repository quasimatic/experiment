import log from "../log";
import browserExecute from '../browser-execute'
import Locator from "./locator";
import emptyOnError from '../empty-on-error';

export default function (located, intersectElements, result, resultHandler) {
    log.debug("Finding intersections");

    return browserExecute(function (located, previous, handler) {
        return handler(null, located.filter(function (e) {
            return previous.indexOf(e) != -1;
        }));
    }, located, intersectElements, function (err, result) {
        log.debug("Intersection count:", result.length);
        return resultHandler(err, result);
    });

    return resultHandler(null, located);
}

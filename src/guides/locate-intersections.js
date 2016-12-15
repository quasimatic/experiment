import log from "../log";
import browserExecute from '../browser-execute'
import Locator from "./locator";

export default function(data, intersectElements, scopeElement, result, resultHandler) {
    log.debug("Finding intersections");

    return Locator.locate({...data, scopeElement}, (err, located) => {
        return browserExecute(function (located, previous, handler) {
            return handler(null, located.filter(function (e) {
                return previous.indexOf(e) != -1;
            }));
        }, located, intersectElements, function (err, result) {
            log.debug("Intersection count:", result.length);
            return resultHandler(err, result);
        });

        return resultHandler(null, located);
    });
}
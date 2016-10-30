import findByCSS from "./lib/css"
import log from "../log"

export default {
    properties: {
        "css": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching as css:", label);

                    return findByCSS(`${label}`, scopeElement, resultHandler);
                }
                catch (err) {
                    return resultHandler(err, []);
                }
            }
        }
    }
}
import findByCSS from "./lib/css"
import log from "../log"

export default {
    options: {
        "class": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching as class name:", label);
                    return findByCSS(`.${label}`, scopeElement, resultHandler);
                }
                catch (e) {
                    return resultHandler(null, []);
                }
            }
        }
    }
}

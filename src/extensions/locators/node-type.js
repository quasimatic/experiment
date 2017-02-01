import findByCSS from "../lib/css"
import log from "../../log"

export default {
    options: {
        "node-type": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                log.debug("Searching by node type:", label);

                return findByCSS(`${label}`, scopeElement, resultHandler);
            }
        }
    }
}
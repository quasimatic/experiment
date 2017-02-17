import findByCSS from "../lib/css"
import log from "../../log"

export default {
    options: {
        "css": {
            locate: function ({label, containerElement}, resultHandler = (err, result) => result) {
                log.debug("Searching as css:", label);

                return findByCSS(`${label}`, containerElement, resultHandler);
            }
        }
    }
}
import findByXPath from "../lib/xpath";
import log from "../../log"

export default {
    options: {
        "exact-text": {
            locate: function ({label, containerElement}, resultHandler = (err, result) => result) {
                log.debug("Searching for text that exact matches:", label);

                return findByXPath(".//*[not(self::script) and text()='" + label + "']", containerElement, resultHandler);
            }
        }
    }
};

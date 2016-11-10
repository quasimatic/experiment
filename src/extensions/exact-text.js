import findByXPath from "./lib/xpath";
import log from "../log"

export default {
    properties: {
        "exact-text": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                log.debug("Searching for text that exact matches:", label);

                return findByXPath(".//*[not(self::script) and text()='" + label + "']", scopeElement, resultHandler);
            }
        }
    }
};

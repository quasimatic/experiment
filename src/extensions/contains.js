import findByXPath from "./lib/xpath"
import log from "../log"

export default {
    properties: {
        "contains": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                log.debug("Searching for text that contains:", label);

                return findByXPath(".//*[not(self::script) and not(self::noscript) and not(self::style) and text()[contains(translate(., 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'),translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]]", scopeElement, resultHandler);
            }
        }
    }
};
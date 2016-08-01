import findByXPath from "./lib/xpath";

export default {
    properties: {
        "exact": {
            locate: function ({label, scopeElement, log={debug:console.log}}, resultHandler = (err, result) => result) {
                log.debug("Searching for text that exact matches:", label);

                return findByXPath(".//*[not(self::script) and text()='" + label + "']", scopeElement, resultHandler);
            }
        }
    }
};

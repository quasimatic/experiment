import findByXPath from "./lib/xpath"

export default {
    properties: {
        "contains": {
            locate: function ({label, scopeElement, log={debug:console.log}}, resultHandler = (err, result) => result) {
                log.debug("Searching for text that contains:", label);

                return findByXPath(".//*[not(self::script) and not(self::noscript) and not(self::style) and text()[contains(translate(., 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'),translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]]", scopeElement, resultHandler);
            }
        }
    }
};
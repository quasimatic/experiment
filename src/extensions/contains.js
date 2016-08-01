import findByXPath from "./xpath"

export default {
    properties: {
        "contains": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath, ".//*[not(self::script) and not(self::noscript) and not(self::style) and text()[contains(translate(., 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'),translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]]", scopeElement, resultHandler);
            }
        }
    }
};
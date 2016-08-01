import findByXPath from "./lib/xpath"

export default {
    properties: {
        name: {
            locate: function ({label, scopeElement, log={debug:console.log}}, resultHandler = (err, result) => result) {
                log.debug("Searching in name:", label);

                return findByXPath(".//*[contains(translate(@name, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, resultHandler);
            }
        }
    }
}

import findByXPath from "./lib/xpath"

export default {
    properties: {
        alt: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                log.debug("Searching by image alt attribute:", label);

                return findByXPath(".//*[contains(translate(@alt, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, resultHandler);
            }
        }
    }
}
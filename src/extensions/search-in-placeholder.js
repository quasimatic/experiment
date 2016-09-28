import findByXPath from "./lib/xpath"

export default {
    properties: {
        searchinplaceholder: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                log.debug("Searching in placeholder:", label);

                return findByXPath(".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, resultHandler);
            }
        }
    }
}

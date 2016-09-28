import findByXPath from "./lib/xpath"

export default {
    properties: {
        searchinname: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                log.debug("Searching in name:", label);

                return findByXPath(".//*[contains(translate(@name, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, resultHandler);
            }
        }
    }
}

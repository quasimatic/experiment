import findByXPath from "./lib/xpath"

export default {
    properties: {
        searchintype: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                log.debug("Searching by type attribute:", label);

                return findByXPath(".//*[translate(@type, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz')=translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz')]", scopeElement, resultHandler);
            }
        }
    }
}
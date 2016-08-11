import findByXPath from "./lib/xpath"

export default {
    properties: {
        searchasid: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                    log.debug("Searching by id:", label);

                    return findByXPath(".//*[translate(@id, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz')=translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz')]", scopeElement, resultHandler);
            }
        }
    }
}
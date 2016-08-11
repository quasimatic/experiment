import findByCSS from "./lib/css"

export default {
    properties: {
        searchasnodetype: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching by node type:", label);

                    return findByCSS(`${label}`, scopeElement, resultHandler);
                }
                catch (err) {
                    return resultHandler(err, []);
                }
            }
        }
    }
}
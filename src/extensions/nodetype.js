import findByCSS from "./lib/css"

export default {
    properties: {
        nodetype: {
            locate: function ({label, scopeElement, log={debug:console.log}}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching by node type:", label);

                    return findByCSS(`${label}`, scopeElement, resultHandler);
                }
                catch (e) {
                    return resultHandler(null, []);
                }
            }
        }
    }
}
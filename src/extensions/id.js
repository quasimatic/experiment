import findByCSS from "./lib/css"

export default {
    properties: {
        id: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching by id:", label);

                    return findByCSS(`#${label}`, scopeElement, resultHandler);
                }
                catch (err) {
                    return resultHandler(err, []);
                }
            }
        }
    }
}

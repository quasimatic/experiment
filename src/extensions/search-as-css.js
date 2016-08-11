import findByCSS from "./lib/css"

export default {
    properties: {
        searchascss: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching as css:", label);

                    return findByCSS(`${label}`, scopeElement, resultHandler);
                }
                catch (err) {
                    return resultHandler(err, []);
                }
            }
        }
    }
}
import findByCSS from "./lib/css"

export default {
    properties: {
        "class": {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                try {
                    return findByCSS(`.${label}`, scopeElement, resultHandler);
                }
                catch (e) {
                    return resultHandler(null, []);
                }
            }
        }
    }
}

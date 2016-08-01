import findByCSS from "./lib/css"

export default {
    properties: {
        classname: {
            locate: function ({label, scopeElement, log={debug:console.log}}, resultHandler = (err, result) => result) {
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

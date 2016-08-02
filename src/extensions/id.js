import findByCSS from "./lib/css"
import escapeCSS from '@walkerrandolphsmith/escape-css-selector'

export default {
    properties: {
        id: {
            locate: function ({label, scopeElement, log={debug:()=>{}}}, resultHandler = (err, result) => result) {
                try {
                    log.debug("Searching by id:", label);

                    return findByCSS(`#${escapeCSS(label)}`, scopeElement, resultHandler);
                }
                catch (err) {
                    return resultHandler(err, []);
                }
            }
        }
    }
}
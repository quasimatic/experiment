import log from "../../log"
import browserExecute from '../../browser-execute'
import defaultHandler from '../../utils/default-result-handler'

export default {
    options: {
        "visible": {
            filter: function visible({elements}, resultHandler = defaultHandler) {
                log.debug("Filtering for visible elements");

                return browserExecute(function (elements, handler) {
                    return handler(null, elements.filter(function (e) {
                        if (e.tagName.toLowerCase() == "option" || e.offsetParent) {
                            return true;
                        }
                        else {
                            var style = window.getComputedStyle(e);
                            return style.position == 'fixed' && style.display != 'none' && style.visibility != 'hidden';
                        }
                    }));
                }, elements, resultHandler);
            }
        }
    }
};
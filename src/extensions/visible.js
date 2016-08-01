export default {
    properties: {
        "visible": {
            filter: function visible({elements, log={debug:console.log}}, resultHandler) {
                log.debug("Filtering for visible elements");

                return resultHandler(null, elements.filter(e => e.tagName.toLowerCase() == "option" || e.offsetParent));
            }
        }
    }
};
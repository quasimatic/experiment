export default {
    properties: {
        "visible": {
            filter: function visible({elements, log={debug:()=>{}}}, resultHandler) {
                log.debug("Filtering for visible elements");

                return browserExecute(function (elements, handler) {
                    try {
                        return handler(null, elements.filter(function(e)  {
                            if (e.tagName.toLowerCase() == "option" || e.offsetParent) {
                                return true;
                            }
                            else {
                                var style = window.getComputedStyle(e);
                                return style.position == 'fixed' && style.display != 'none' && style.visibility != 'hidden';
                            }
                        }));
                    }
                    catch (err) {
                        return handler(err, []);
                    }
                }, elements, resultHandler);
            }
        }
    }
};
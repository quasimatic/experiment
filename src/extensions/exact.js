import findByXPath from "./xpath";

export default {
    properties: {
        "exact": {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath,  ".//*[not(self::script) and text()='" + label + "']", scopeElement, resultHandler);
            }
        }
    }
};

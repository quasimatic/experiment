import findByXPath from "./xpath";

export default {
    properties: {
        "exact": {
            locate: function ({label, container}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath,  ".//*[not(self::script) and text()='" + label + "']", container, resultHandler);
            }
        }
    }
};

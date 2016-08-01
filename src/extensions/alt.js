import findByXPath from "./xpath"

export default {
    properties: {
        alt: {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath, ".//*[contains(translate(@alt, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, resultHandler);
            }
        }
    }
}
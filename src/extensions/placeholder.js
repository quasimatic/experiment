import findByXPath from "./xpath"

export default {
    properties: {
        placeholder: {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath, ".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, resultHandler);
            }
        }
    }
}

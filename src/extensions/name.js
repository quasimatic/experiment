import findByXPath from "./xpath"

export default {
    properties: {
        name: {
            locate: function ({label, scopeElement}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath, ".//*[contains(translate(@name, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, resultHandler);
            }
        }
    }
}

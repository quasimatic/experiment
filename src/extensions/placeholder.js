import findByXPath from "./xpath"

export default {
    properties: {
        placeholder: {
            locate: function ({label, container}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath, ".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container, resultHandler);
            }
        }
    }
}

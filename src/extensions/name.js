import findByXPath from "./xpath"

export default {
    properties: {
        name: {
            locate: function ({label, container}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath, ".//*[contains(translate(@name, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container, resultHandler);
            }
        }
    }
}

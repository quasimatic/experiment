import findByXPath from "./xpath"

export default {
    properties: {
        alt: {
            locate: function ({label, container}, resultHandler = (err, result) => result) {
                return browserExecute(findByXPath, ".//*[contains(translate(@alt, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container, resultHandler);
            }
        }
    }
}
import findByXPath from "./xpath"

export default function ({label, container, config}, resultHandler = (err, result) => result) {
    return browserExecute(findByXPath, ".//*[contains(translate(@alt, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container, resultHandler);
}

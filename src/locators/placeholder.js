import findByXPath from "./xpath"

export default function (label, container, config, resultHandler = result => result) {
    return customExecute(findByXPath, ".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container, resultHandler);
}

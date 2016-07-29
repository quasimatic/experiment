import findByXPath from "./xpath"

export default function ({label, container, config}, resultHandler = (err, result) => result) {
    console.log(label)
    console.log(container)
    console.log(config)
    return browserExecute(findByXPath, ".//*[contains(translate(@placeholder, 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", container, resultHandler);
}

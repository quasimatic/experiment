import findByCSS from "./css"

export default function (label, container, config, resultHandler = (err, result) => result) {
    try {
        return customExecute(findByCSS, `#${label}`, container, resultHandler);
    }
    catch (e) {
        return resultHandler(null, []);
    }
}

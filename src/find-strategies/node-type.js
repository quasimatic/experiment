import findByCSS from "./css"

export default function (target, container) {
    try {
        return findByCSS(`${target}`, container);
    }
    catch (e) {
        return false;
    }
}

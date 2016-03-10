import findByCSS from "./css"

export default function (target, container) {
    try {
        console.log(`#${target}`)
        return findByCSS(`#${target}`, container);
    }
    catch (e) {
        return false;
    }
}

import findByCSS from "./css"

export default function(label, container) {
    try {
        return findByCSS(`.${label}`, container);
    }
    catch (e) {
        return [];
    }
}

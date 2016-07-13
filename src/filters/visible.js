export default function visible(elements, data, resultHandler) {
    return resultHandler(null, elements.filter(e => e.tagName.toLowerCase() == "option" || e.offsetParent));
}
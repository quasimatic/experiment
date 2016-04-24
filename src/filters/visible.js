export default function visible(elements) {
    return elements.filter(e => e.tagName.toLowerCase() == "option" || e.offsetParent);
}
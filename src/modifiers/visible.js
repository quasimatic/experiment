export default {
    "visible": {
        default: true,
        filter: function (elements) {
            return elements.filter(e => e.tagName.toLowerCase() == "option" || e.offsetParent);
        }
    }
}
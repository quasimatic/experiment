import findByCustomLabel from "./custom-label"
import findByExactText from "./exact-text"
import findByContainsText from "./contains-text"
import findByID from "./id"
import findByClass from "./class-name"
import findByNodeType from "./node-type"

export default function (target, container, customLabels) {
    var e = findByCustomLabel(target, container, customLabels || {});
    if (e.length > 0) return e;

    e = findByExactText(target, container);
    if (e.length > 0) return e;

    e = findByContainsText(target, container);
    if (e.length > 0) return e;

    e = findByID(target, container);
    if (e.length > 0) return e;

    e = findByClass(target, container);
    if (e.length > 0) return e;

    e = findByNodeType(target, container);
    if (e.length > 0) return e;

    return e;
}

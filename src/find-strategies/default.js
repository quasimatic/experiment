import log from '../logger';

import findByCustomLabel from "./custom-label"
import findByExactText from "./exact-text"
import findByContainsText from "./contains-text"
import findByID from "./id"
import findByClass from "./class-name"
import findByNodeType from "./node-type"

export default function (label, container, customLabels) {
    log.debug("Searching by custom label:", label);
    var e = findByCustomLabel(label, container, customLabels || {});
    if (e.length > 0) {
        log.info("Matched using custom label:", label);
        return e;
    }
    
    log.debug("Searching for exact text:", label);
    e = findByExactText(label, container);
    if (e.length > 0) {
        log.info("Matched using exact text:", label);
        return e;
    }

    log.debug("Searching for text that contains:", label);
    e = findByContainsText(label, container);
    if (e.length > 0) {
        log.info("Matched using contains text:", label);
        return e;
    }

    log.debug("Searching by id:", label);
    e = findByID(label, container);
    if (e.length > 0) {
        log.info("Matched using ID:", label);
        return e;
    }

    log.debug("Searching for css class:", label);
    e = findByClass(label, container);
    if (e.length > 0) {
        log.info("Matched using css class:", label);
        return e;
    }

    log.debug("Searching by node type:", label);
    e = findByNodeType(label, container);
    if (e.length > 0) {
        log.info("Matched using node type:", label);
        return e;
    }

    return e;
}

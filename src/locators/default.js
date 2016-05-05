import log from '../logger';

import findByCustomLabel from "./custom-label"
import findByContainsText from "./contains-text"
import findByID from "./id"
import findByClass from "./class-name"
import findByName from "./name"
import findByValue from "./value"
import findByPlaceholder from "./placeholder"
import findByImage from "./image"
import findByNodeType from "./node-type"

export default function(label, container, config) {
    log.debug("Searching by custom label:", label);
    let e = findByCustomLabel(label, container, config);
    if (e.length > 0) {
        log.info("Matched using custom label:", label);
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

    log.debug("Searching in name:", label);
    e = findByName(label, container);
    if (e.length > 0) {
        log.info("Matched using name:", label);
        return e;
    }

    log.debug("Searching in value:", label);
    e = findByValue(label, container);
    if (e.length > 0) {
        log.info("Matched using value:", label);
        return e;
    }

    log.debug("Searching in placeholder:", label);
    e = findByPlaceholder(label, container);
    if (e.length > 0) {
        log.info("Matched using placeholder:", label);
        return e;
    }

    log.debug("Searching for image alt:", label);
    e = findByImage(label, container);
    if (e.length > 0) {
        log.info("Matched using image alt:", label);
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

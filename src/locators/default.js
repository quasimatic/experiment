import log from '../logger';
import {until} from "../utils/array-utils";

import findByCustomLabel from "./custom-label"
import findByContainsText from "./contains-text"
import findByID from "./id"
import findByClass from "./class-name"
import findByName from "./name"
import findByValue from "./value"
import findByPlaceholder from "./placeholder"
import findByImage from "./image"
import findByNodeType from "./node-type"

export default function (label, container, config, resultHandler) {
    let locators = [
        (callback) => {
            log.debug("Searching by custom label:", label);
            return findByCustomLabel(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using custom label:", label);
                }
                return callback(e);
            });
        },

        (callback) => {
            log.debug("Searching for text that contains:", label);
            return findByContainsText(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using contains text:", label);
                }
                return callback(e);
            });
        },

        (callback) => {
            log.debug("Searching by id:", label);
            return findByID(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using ID:", label);
                }
                return callback(e);
            });
        },

        (callback) => {

            log.debug("Searching for css class:", label);
            return findByClass(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using css class:", label);
                }
                return callback(e);
            });
        },

        (callback) => {

            log.debug("Searching in name:", label);
            return findByName(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using name:", label);
                }
                return callback(e);
            });
        },

        (callback) => {
            log.debug("Searching in value:", label);
            return findByValue(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using value:", label);
                }
                return callback(e);
            });
        },

        (callback) => {
            log.debug("Searching in placeholder:", label);
            return findByPlaceholder(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using placeholder:", label);
                }
                return callback(e);
            });
        },

        (callback) => {
            log.debug("Searching for image alt:", label);
            return findByImage(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using image alt:", label);
                }
                return callback(e);
            });
        },

        (callback) => {
            log.debug("Searching by node type:", label);
            return findByNodeType(label, container, config, function (e) {
                if (e.length > 0) {
                    log.info("Matched using node type:", label);
                }
                return callback(e);
            });
        }
    ];

    return until(locators, (elements)=> elements.length > 0, result => resultHandler(result || []));
}

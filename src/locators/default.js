import log from '../logger';
import {reduce, until} from "../utils/array-utils";

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
            return findByCustomLabel(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }

                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching for text that contains:", label);
            return findByContainsText(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }
                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching in value:", label);
            return findByValue(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }
                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching in placeholder:", label);
            return findByPlaceholder(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }
                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching by id:", label);
            return findByID(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }
                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching for css class:", label);
            return findByClass(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }
                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching in name:", label);
            return findByName(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }
                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching for image alt:", label);
            return findByImage(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }
                return callback(null, e);
            });
        },

        (callback) => {
            log.debug("Searching by node type:", label);
            return findByNodeType(label, container, config, function (err, e) {
                if (e.length > 0) {
                    log.debug(`Matched ${e.length}`);
                }

                return callback(null, e);
            });
        }
    ];

     return reduce(locators, [], (elements, locator, handler) => {
        return locator(function (err, e) {
            elements = elements.concat(e);
            return handler(err, elements);
        });
    }, resultHandler);
}

import Modifiers from "../utils/modifiers"

import isDescendant from '../utils/is-descendant';

export default function(label, scope, config) {
    let elements = [];
    if (config.preload) {
        if (config.preload.labels) {
            elements = [].concat(config.preload.labels[label]);
        }
    }

    if (elements.length == 0) {
        let customLabel = Modifiers.locatorForLabel(label, config.extensions || []);

        elements = customLabel.reduce((e, c) => {
            if (e.length > 0) return e;

            if (c.locate) {
                return [].concat(c.locate(label, scope, config));
            }

            return [];
        }, [])
    }

    let r = [];

    try {
        elements.forEach(function(e) {
            if (isDescendant(scope, e)) {
                r.push(e)
            }
        });

        return r;
    }
    catch (e) {
        return [];
    }
}
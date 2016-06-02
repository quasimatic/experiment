import Modifiers from "../utils/modifiers"

import isDescendant from '../utils/is-descendant';

export default function (label, scope, config, resultHandler = result => result) {
    let elements = [];
    
    if (elements.length == 0) {
        let customLabel = Modifiers.locatorForLabel(label, config.extensions || []);

        elements = customLabel.reduce((e, c) => {
            if (e.length > 0) return e;

            if (c.locate) {
                return [].concat(c.locate(label, scope, config, function (result) {
                    return result
                }));
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

        return resultHandler(r);
    }
    catch (e) {
        return resultHandler([]);
    }
}